import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { AiService } from './ai.service';
import { PrismaService } from '../prisma/prisma.service';

@Processor('ai-jobs')
export class AiProcessor extends WorkerHost {
  private readonly logger = new Logger(AiProcessor.name);

  constructor(
    private readonly aiService: AiService,
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);

    switch (job.name) {
      case 'process-lead':
        return this.handleProcessLead(job.data);
      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
    }
  }

  private async handleProcessLead(data: { customerId: string, leadData: any, orgId: string }) {
    try {
      this.logger.log(`Generating summary for customer ${data.customerId}`);
      const aiResult = await this.aiService.generateBuyerSummary(data.leadData);

      // Update customer in DB
      await this.prisma.customer.update({
        where: { id: data.customerId },
        data: {
          score: aiResult.score,
          scoreReason: aiResult.scoreReason,
          aiSummary: aiResult.summary,
          priority: aiResult.score >= 80 ? 'HIGH' : aiResult.score >= 50 ? 'MEDIUM' : 'LOW'
        }
      });

      // Also update associated leads if any
      const leads = await this.prisma.lead.findMany({ where: { customerId: data.customerId } });
      for (const lead of leads) {
        await this.prisma.lead.update({
          where: { id: lead.id },
          data: {
             score: aiResult.score,
             priority: aiResult.score >= 80 ? 'HIGH' : aiResult.score >= 50 ? 'MEDIUM' : 'LOW'
          }
        });
        
        // Add a Task for follow-up based on AI processing
        await this.prisma.task.create({
          data: {
            organizationId: data.orgId,
            title: `AI Processed: Follow up with new lead`,
            description: `Lead Score: ${aiResult.score}. AI Summary: ${aiResult.summary}`,
            dueDate: new Date(),
            status: 'PENDING',
            priority: aiResult.score >= 80 ? 'HIGH' : 'MEDIUM',
            leadId: lead.id,
          }
        });
      }

      this.logger.log(`Finished processing lead for customer ${data.customerId}`);
      return { success: true, score: aiResult.score };
    } catch (error) {
      this.logger.error(`Error processing lead for customer ${data.customerId}`, error);
      throw error;
    }
  }
}
