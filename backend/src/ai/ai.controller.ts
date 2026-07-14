import { Controller, Post, Body, Get } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(@InjectQueue('ai-jobs') private aiQueue: Queue) {}

  @Post('trigger-lead-processing')
  @ApiOperation({ summary: 'Manually trigger background AI processing for a lead' })
  async triggerLeadProcessing(@Body() body: { customerId: string, leadData: any, orgId: string }) {
    const job = await this.aiQueue.add('process-lead', body, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 }
    });
    return { success: true, jobId: job.id, message: 'Job queued successfully' };
  }

  @Get('queue-status')
  @ApiOperation({ summary: 'Get status of the AI jobs queue' })
  async getQueueStatus() {
    const [waiting, active, completed, failed] = await Promise.all([
      this.aiQueue.getWaitingCount(),
      this.aiQueue.getActiveCount(),
      this.aiQueue.getCompletedCount(),
      this.aiQueue.getFailedCount(),
    ]);

    return {
      queue: 'ai-jobs',
      waiting,
      active,
      completed,
      failed
    };
  }
}
