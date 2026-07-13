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
    // Zero-Cost "AI Engine": Calculate Intent Score based on data
    let score = 50;
    
    // Budget & Readiness modifiers
    if (data.timeline === 'immediate') score += 20;
    else if (data.timeline === '3_months') score += 10;

    if (data.downPayment === 'ready') score += 20;
    else if (data.downPayment === 'arranging') score += 5;

    if (data.budget && data.budget >= 10000000) score += 10; // >1Cr budget

    // Cap score at 99
    score = Math.min(score, 99);

    const customer = await this.prisma.customer.create({
      data: {
        name: data.customerName || 'Anonymous',
        email: data.customerEmail || `${Date.now()}@example.com`,
        phone: data.customerPhone || '',
        budget: data.budget ? parseFloat(data.budget) : 0,
        preferredLocation: data.location || data.type || '',
      }
    });

    const lead = await this.prisma.lead.create({
      data: {
        organizationId: orgId,
        customerId: customer.id,
        status: data.status || 'NEW',
        score: score,
        priority: score > 80 ? 'HIGH' : score > 60 ? 'MEDIUM' : 'LOW',
        source: 'Public Intake Form',
      },
      include: { customer: true }
    });

    // Automatically add a note simulating CIBIL and intent analysis
    const cibilTier = score > 80 ? 'Excellent' : score > 60 ? 'Good' : 'Fair';
    await this.prisma.note.create({
      data: {
        leadId: lead.id,
        content: `🤖 AI Verification Report:\n- Simulated CIBIL Tier: ${cibilTier}\n- Timeline: ${data.timeline || 'N/A'}\n- Down Payment: ${data.downPayment || 'N/A'}\n- Initial Intent Score: ${score}/100`,
      }
    });

    return lead;
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
