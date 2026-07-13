import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { SubmitWizardDto } from './dto/submit-wizard.dto';

@Injectable()
export class LeadEngineService {
  private readonly logger = new Logger(LeadEngineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiService,
  ) {}

  async processSubmission(dto: SubmitWizardDto) {
    // 1. Parse Data
    const budgetMax = this.parseBudget(dto.budgetRange);
    
    // Default orgId for single-tenant demo if none provided
    const defaultOrg = await this.prisma.organization.findFirst();
    const orgId = dto.orgId || defaultOrg?.id;
    
    if (!orgId) throw new Error("No organization found");

    // 2. Call AI for Summary & Score
    const aiResult = await this.ai.generateBuyerSummary(dto);

    // 3. Save Customer Record
    const customer = await this.prisma.customer.create({
      data: {
        organizationId: orgId,
        name: dto.name,
        phone: dto.phone,
        email: dto.email,
        whatsapp: dto.whatsapp || dto.phone,
        source: dto.source || 'Website',
        
        // Wizard Details
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
        
        // AI Results
        score: aiResult.score,
        scoreReason: aiResult.scoreReason,
        aiSummary: aiResult.summary,
        status: 'NEW',
        priority: aiResult.score >= 80 ? 'HIGH' : aiResult.score >= 50 ? 'MEDIUM' : 'LOW'
      }
    });

    // 4. Create Lead Record to track this specific interaction
    const lead = await this.prisma.lead.create({
      data: {
        customerId: customer.id,
        organizationId: orgId,
        source: customer.source,
        score: customer.score,
        priority: customer.priority,
        status: 'NEW',
      }
    });

    // 5. Match Properties
    const matches = await this.matchProperties(customer, orgId);

    // 6. Create Follow-up Task
    await this.prisma.task.create({
      data: {
        organizationId: orgId,
        title: `Follow up with new AI lead: ${customer.name}`,
        description: `Lead Score: ${customer.score}. AI Summary: ${customer.aiSummary}`,
        dueDate: new Date(),
        status: 'PENDING',
        priority: customer.priority,
        leadId: lead.id,
      }
    });

    // 7. Return matches so the Thank You page can display them
    return {
      success: true,
      customerId: customer.id,
      matches,
      aiSummary: aiResult.summary
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
