import { Injectable, Logger } from '@nestjs/common';
import { AiService } from './ai.service';
import { PrismaService } from '../prisma/prisma.service';

// NOTE: AiProcessor is kept for future use with BullMQ when Redis becomes available.
// It is not active currently — AI processing runs synchronously in LeadEngineService.
@Injectable()
export class AiProcessor {
  private readonly logger = new Logger(AiProcessor.name);

  constructor(
    private readonly aiService: AiService,
    private readonly prisma: PrismaService,
  ) {}

  async processLead(data: { customerId: string; leadData: any; orgId: string }) {
    try {
      this.logger.log(`Processing lead for customer ${data.customerId}`);
      const aiResult = await this.aiService.generateBuyerSummary(data.leadData);

      await this.prisma.customer.update({
        where: { id: data.customerId },
        data: {
          score: aiResult.score,
          scoreReason: aiResult.scoreReason,
          aiSummary: aiResult.summary,
          priority: aiResult.score >= 80 ? 'HIGH' : aiResult.score >= 50 ? 'MEDIUM' : 'LOW',
        },
      });

      this.logger.log(`Lead processed for customer ${data.customerId} — Score: ${aiResult.score}`);
      return { success: true, score: aiResult.score };
    } catch (error) {
      this.logger.error(`Error processing lead for ${data.customerId}`, error);
      throw error;
    }
  }
}
