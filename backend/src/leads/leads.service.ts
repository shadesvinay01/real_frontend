import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async findAll(orgId: string) {
    return this.prisma.lead.findMany({
      where: { organizationId: orgId },
      include: {
        customer: true,
      },
      orderBy: { updatedAt: 'desc' }
    });
  }

  async create(orgId: string, data: any) {
    // Basic mock logic: create customer if email doesn't exist, then link lead.
    // In production, we'd take customer details and lead details properly typed.
    const customer = await this.prisma.customer.create({
      data: {
        name: data.customerName,
        email: data.customerEmail || `${Date.now()}@example.com`,
        budget: data.budget || 0,
        preferredLocation: data.type || '',
      }
    });

    return this.prisma.lead.create({
      data: {
        organizationId: orgId,
        customerId: customer.id,
        status: data.status || 'NEW',
        score: data.score || Math.floor(Math.random() * 100),
        priority: data.priority || 'MEDIUM',
      },
      include: { customer: true }
    });
  }

  async updateStatus(id: string, orgId: string, status: string) {
    const lead = await this.prisma.lead.findFirst({
      where: { id, organizationId: orgId }
    });

    if (!lead) throw new NotFoundException('Lead not found');

    return this.prisma.lead.update({
      where: { id },
      data: { status },
      include: { customer: true }
    });
  }
}
