import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { SubmitWizardDto } from './dto/submit-wizard.dto';

@Injectable()
export class LeadEngineService {
  private readonly logger = new Logger(LeadEngineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiService,
    @InjectQueue('ai-jobs') private aiQueue: Queue
  ) {}

  async processSubmission(dto: SubmitWizardDto) {
    const budgetMax = this.parseBudget(dto.budgetRange);
    
    const defaultOrg = await this.prisma.organization.findFirst();
    const orgId = dto.orgId || defaultOrg?.id;
    
    if (!orgId) throw new Error("No organization found");

    // 1. Save Customer Record (Initial state before AI)
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
        priority: 'MEDIUM', // Will be updated by AI worker
      }
    });

    // 2. Create Lead Record
    const lead = await this.prisma.lead.create({
      data: {
        customerId: customer.id,
        organizationId: orgId,
        source: customer.source,
        status: 'NEW',
      }
    });

    // 3. Queue the AI Job for async processing
    await this.aiQueue.add('process-lead', {
      customerId: customer.id,
      leadData: dto,
      orgId
    }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 }
    });

    // 4. Immediately return matches based on raw criteria
    const matches = await this.matchProperties(customer, orgId);

    return {
      success: true,
      customerId: customer.id,
      matches,
      aiSummary: 'Processing AI insights in the background...' // Initial UI placeholder
    };
  }

  private async matchProperties(customer: any, orgId: string) {
    const allProperties = await this.prisma.property.findMany({
      where: { organizationId: orgId, status: 'AVAILABLE' }
    });

    const matches = allProperties.map(prop => {
      let matchScore = 100;
      let reason = '';

      // Budget match
      if (customer.budgetMax && prop.price > customer.budgetMax * 1.1) {
        matchScore -= 30; // significantly over budget
      } else if (customer.budgetMax && prop.price > customer.budgetMax) {
         matchScore -= 10; // slightly over budget
      }

      // Type match
      if (customer.propertyTypes) {
        try {
           const types = JSON.parse(customer.propertyTypes);
           if (!types.includes(prop.type)) matchScore -= 40;
        } catch(e){}
      }

      // Location match (fuzzy)
      if (customer.preferredLocations && prop.location) {
         try {
           const locs = JSON.parse(customer.preferredLocations) as string[];
           const matchLoc = locs.some(l => prop.location.toLowerCase().includes(l.toLowerCase()));
           if (!matchLoc) matchScore -= 20;
         } catch(e){}
      }
      
      if (matchScore >= 80) reason = 'Strong match across budget and location.';
      else if (matchScore >= 50) reason = 'Good alternative based on your profile.';
      else reason = 'Might be outside some parameters but worth considering.';

      return {
        ...prop,
        match: Math.max(0, matchScore),
        reason
      };
    });

    // Sort descending and return top 5
    return matches.sort((a, b) => b.match - a.match).slice(0, 5);
  }

  // Simple parser to extract numbers from strings like "50L - 1Cr"
  private parseBudget(str?: string): number | null {
    if (!str) return null;
    let val = 0;
    const lower = str.toLowerCase();
    const numbers = str.match(/\d+(\.\d+)?/g);
    if (!numbers) return null;
    
    // Pick the largest number in the range
    const num = Math.max(...numbers.map(Number));
    
    if (lower.includes('cr') || lower.includes('crore')) val = num * 10000000;
    else if (lower.includes('l') || lower.includes('lakh')) val = num * 100000;
    else val = num;
    
    return val;
  }
}
