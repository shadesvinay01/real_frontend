import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBuyerDto } from './dto/create-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { QueryBuyerDto, SortOrder } from './dto/query-buyer.dto';

@Injectable()
export class BuyersService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── SCORING ENGINE ────────────────────────────────────────────────────────
  private calculateScore(data: Partial<CreateBuyerDto>): { score: number; reason: string } {
    let score = 30;
    const reasons: string[] = [];

    if (data.budgetMin && data.budgetMax) {
      score += 15;
      reasons.push('Budget defined');
    }
    if (data.loanRequired === false) {
      score += 15;
      reasons.push('No loan needed');
    } else if (data.loanRequired === true) {
      score += 5;
      reasons.push('Loan required');
    }
    if (data.annualIncome && data.budgetMax && data.annualIncome > data.budgetMax * 0.3) {
      score += 15;
      reasons.push('Strong income-to-budget ratio');
    }
    if (data.preferredLocations) {
      score += 10;
      reasons.push('Locations specified');
    }
    if (data.bedrooms) {
      score += 5;
      reasons.push('Bedroom preference defined');
    }
    if (data.propertyTypes) {
      score += 5;
      reasons.push('Property type defined');
    }
    if (data.priority === 'HIGH') {
      score += 5;
      reasons.push('High priority');
    }

    return {
      score: Math.min(score, 99),
      reason: reasons.join(', '),
    };
  }

  // ─── LIST (paginated, filtered, sorted, searched) ──────────────────────────
  async findAll(orgId: string, query: QueryBuyerDto) {
    const {
      search,
      status,
      priority,
      source,
      assignedBrokerId,
      sortBy = 'createdAt',
      sortOrder = SortOrder.desc,
      page = 1,
      limit = 20,
    } = query;

    const skip = (page - 1) * limit;

    const where: any = {
      organizationId: orgId,
    };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { company: { contains: search } },
      ];
    }
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (source) where.source = source;
    if (assignedBrokerId) where.assignedBrokerId = assignedBrokerId;

    const allowedSortFields = [
      'createdAt', 'updatedAt', 'name', 'score', 'priority', 'status', 'budgetMax',
    ];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';

    const [data, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [safeSortBy]: sortOrder },
        include: {
          assignedBroker: { select: { id: true, name: true, email: true, avatarUrl: true } },
          _count: { select: { leads: true, documents: true } },
        },
      }),
      this.prisma.customer.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ─── FIND ONE ──────────────────────────────────────────────────────────────
  async findOne(id: string, orgId: string) {
    const buyer = await this.prisma.customer.findFirst({
      where: { id, organizationId: orgId },
      include: {
        assignedBroker: { select: { id: true, name: true, email: true, avatarUrl: true } },
        leads: {
          orderBy: { createdAt: 'desc' },
          include: {
            notes: { orderBy: { createdAt: 'desc' }, take: 5 },
            activities: { orderBy: { createdAt: 'desc' }, take: 10 },
            tasks: { orderBy: { dueDate: 'asc' } },
          },
        },
        documents: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!buyer) throw new NotFoundException(`Buyer ${id} not found`);
    return buyer;
  }

  // ─── CREATE ────────────────────────────────────────────────────────────────
  async create(orgId: string, dto: CreateBuyerDto, userId: string) {
    // Check duplicate email
    if (dto.email) {
      const existing = await this.prisma.customer.findFirst({
        where: { email: dto.email, organizationId: orgId },
      });
      if (existing) throw new ConflictException('A buyer with this email already exists');
    }

    const { score, reason } = this.calculateScore(dto);

    const buyer = await this.prisma.customer.create({
      data: {
        ...dto,
        budget: dto.budgetMin,  // backward compat
        preferredLocation: dto.preferredLocations,  // backward compat
        organizationId: orgId,
        score,
        scoreReason: reason,
        status: dto.status || 'NEW',
        priority: dto.priority || 'MEDIUM',
      },
      include: {
        assignedBroker: { select: { id: true, name: true } },
      },
    });

    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        organizationId: orgId,
        userId,
        action: 'CREATED',
        resource: 'BUYER',
        resourceId: buyer.id,
      },
    }).catch(() => {}); // non-blocking

    return buyer;
  }

  // ─── UPDATE ────────────────────────────────────────────────────────────────
  async update(id: string, orgId: string, dto: UpdateBuyerDto, userId: string) {
    await this.findOne(id, orgId); // ensure exists & belongs to org

    const { score, reason } = this.calculateScore(dto as any);

    const buyer = await this.prisma.customer.update({
      where: { id },
      data: {
        ...dto,
        budget: dto.budgetMin ?? undefined,
        preferredLocation: dto.preferredLocations ?? undefined,
        score,
        scoreReason: reason,
      },
      include: {
        assignedBroker: { select: { id: true, name: true } },
      },
    });

    await this.prisma.auditLog.create({
      data: { organizationId: orgId, userId, action: 'UPDATED', resource: 'BUYER', resourceId: id },
    }).catch(() => {});

    return buyer;
  }

  // ─── DELETE ────────────────────────────────────────────────────────────────
  async remove(id: string, orgId: string, userId: string) {
    await this.findOne(id, orgId);
    await this.prisma.customer.delete({ where: { id } });
    await this.prisma.auditLog.create({
      data: { organizationId: orgId, userId, action: 'DELETED', resource: 'BUYER', resourceId: id },
    }).catch(() => {});
    return { success: true };
  }

  // ─── BULK DELETE ───────────────────────────────────────────────────────────
  async bulkDelete(ids: string[], orgId: string, userId: string) {
    const result = await this.prisma.customer.deleteMany({
      where: { id: { in: ids }, organizationId: orgId },
    });
    await this.prisma.auditLog.create({
      data: {
        organizationId: orgId, userId, action: 'DELETED',
        resource: 'BUYER', resourceId: ids.join(','),
        changes: `Bulk deleted ${result.count} buyers`,
      },
    }).catch(() => {});
    return { deleted: result.count };
  }

  // ─── BULK STATUS UPDATE ────────────────────────────────────────────────────
  async bulkUpdateStatus(ids: string[], status: string, orgId: string) {
    const result = await this.prisma.customer.updateMany({
      where: { id: { in: ids }, organizationId: orgId },
      data: { status },
    });
    return { updated: result.count };
  }

  // ─── EXPORT CSV ────────────────────────────────────────────────────────────
  async exportCsv(orgId: string): Promise<string> {
    const buyers = await this.prisma.customer.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: 'desc' },
    });

    const headers = [
      'Name', 'Email', 'Phone', 'WhatsApp', 'Status', 'Priority',
      'Budget Min', 'Budget Max', 'Locations', 'Property Types',
      'Loan Required', 'Occupation', 'Company', 'Annual Income',
      'Source', 'Score', 'Created At',
    ];

    const rows = buyers.map((b) => [
      b.name, b.email ?? '', b.phone ?? '', b.whatsapp ?? '',
      b.status, b.priority, b.budgetMin ?? '', b.budgetMax ?? '',
      b.preferredLocations ?? '', b.propertyTypes ?? '',
      b.loanRequired ? 'Yes' : 'No', b.occupation ?? '', b.company ?? '',
      b.annualIncome ?? '', b.source ?? '', b.score, b.createdAt.toISOString(),
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));

    return [headers.join(','), ...rows].join('\n');
  }

  // ─── IMPORT CSV ────────────────────────────────────────────────────────────
  async importCsv(csvContent: string, orgId: string, userId: string): Promise<{ imported: number; errors: string[] }> {
    const lines = csvContent.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) return { imported: 0, errors: ['Empty CSV'] };

    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase());
    const errors: string[] = [];
    let imported = 0;

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(',').map(v => v.replace(/^"|"$/g, '').trim());
        const row: any = {};
        headers.forEach((h, idx) => { row[h] = values[idx] || ''; });

        if (!row['name']) { errors.push(`Row ${i}: Name is required`); continue; }

        await this.prisma.customer.create({
          data: {
            organizationId: orgId,
            name: row['name'],
            email: row['email'] || undefined,
            phone: row['phone'] || undefined,
            status: row['status'] || 'NEW',
            priority: row['priority'] || 'MEDIUM',
            budgetMin: row['budget min'] ? parseFloat(row['budget min']) : undefined,
            budgetMax: row['budget max'] ? parseFloat(row['budget max']) : undefined,
            source: row['source'] || undefined,
            score: 50,
          },
        });
        imported++;
      } catch (err: any) {
        errors.push(`Row ${i}: ${err.message}`);
      }
    }

    return { imported, errors };
  }
}
