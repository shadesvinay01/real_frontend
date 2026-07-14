import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { AiProcessor } from '../ai/ai.processor';
import { SubmitWizardDto } from './dto/submit-wizard.dto';

@Injectable()
export class LeadEngineService {
  private readonly logger = new Logger(LeadEngineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiService,
    private readonly aiProcessor: AiProcessor,
  ) {}

  async processSubmission(dto: SubmitWizardDto) {
    const budgetMax = this.parseBudget(dto.budgetRange);

    const defaultOrg = await this.prisma.organization.findFirst();
    const orgId = dto.orgId || defaultOrg?.id;

    if (!orgId) throw new Error('No organization found');

    // 1. Save Customer Record (initial, before AI)
    const customer = await this.prisma.customer.create({
      data: {
        organizationId: orgId,
        name: dto.name,
        phone: dto.phone,
        email: dto.email,
        whatsapp: dto.whatsapp || dto.phone,
        source: dto.source || 'Website',
        purpose: dto.purpose,
        propertyTypes: dto.type ? JSON.stringify([dto.type]) : null,
        budgetMax: budgetMax,
        preferredLocations: dto.location ? JSON.stringify([dto.location]) : null,
        timeline: dto.timeline,
        loanRequired: dto.loanRequired === 'Yes',
        occupation: dto.occupation,
        cibilRange: dto.cibil,
        annualIncome: this.parseBudget(dto.income),
        preferences: dto.preferences ? JSON.stringify(dto.preferences) : null,
        contactTime: dto.contactTime,
        status: 'NEW',
        priority: 'MEDIUM',
      },
    });

    // 2. Create Lead Record
    const lead = await this.prisma.lead.create({
      data: {
        customerId: customer.id,
        organizationId: orgId,
        source: customer.source,
        status: 'NEW',
      },
    });

    // 3. Run AI Processing (synchronous — will be async with Redis/BullMQ when available)
    this.logger.log(`Running AI processing for customer ${customer.id}`);
    this.aiProcessor.processLead({
      customerId: customer.id,
      leadData: dto,
      orgId,
    }).then(async (result) => {
      // After AI scoring, create the follow-up task
      await this.prisma.task.create({
        data: {
          organizationId: orgId,
          title: `Follow up: ${customer.name}`,
          description: `AI Score: ${result.score}. Review buyer requirements and schedule a call.`,
          dueDate: new Date(),
          status: 'PENDING',
          priority: result.score >= 80 ? 'HIGH' : 'MEDIUM',
          leadId: lead.id,
        },
      });
    }).catch((err) => {
      this.logger.error('AI processing failed', err);
    });

    // 4. Immediately return property matches (don't wait for AI)
    const matches = await this.matchProperties(customer, orgId);

    return {
      success: true,
      customerId: customer.id,
      matches,
      aiSummary: 'AI insights are being processed...',
    };
  }

  private async matchProperties(customer: any, orgId: string) {
    const allProperties = await this.prisma.property.findMany({
      where: { organizationId: orgId, status: 'AVAILABLE' },
    });

    const matches = allProperties.map((prop) => {
      let matchScore = 100;
      let reason = '';

      if (customer.budgetMax && prop.price > customer.budgetMax * 1.1) {
        matchScore -= 30;
      } else if (customer.budgetMax && prop.price > customer.budgetMax) {
        matchScore -= 10;
      }

      if (customer.propertyTypes) {
        try {
          const types = JSON.parse(customer.propertyTypes);
          if (!types.includes(prop.type)) matchScore -= 40;
        } catch (e) {}
      }

      if (customer.preferredLocations && prop.location) {
        try {
          const locs = JSON.parse(customer.preferredLocations) as string[];
          const matchLoc = locs.some((l) =>
            prop.location.toLowerCase().includes(l.toLowerCase()),
          );
          if (!matchLoc) matchScore -= 20;
        } catch (e) {}
      }

      if (matchScore >= 80) reason = 'Strong match across budget and location.';
      else if (matchScore >= 50) reason = 'Good alternative based on your profile.';
      else reason = 'Might be outside some parameters but worth considering.';

      return { ...prop, match: Math.max(0, matchScore), reason };
    });

    return matches.sort((a, b) => b.match - a.match).slice(0, 5);
  }

  private parseBudget(str?: string): number | null {
    if (!str) return null;
    const lower = str.toLowerCase();
    const numbers = str.match(/\d+(\.\d+)?/g);
    if (!numbers) return null;
    const num = Math.max(...numbers.map(Number));
    if (lower.includes('cr') || lower.includes('crore')) return num * 10000000;
    if (lower.includes('l') || lower.includes('lakh')) return num * 100000;
    return num;
  }
}
