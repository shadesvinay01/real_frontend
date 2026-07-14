import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AiService } from './ai.service';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-summary')
  @ApiOperation({ summary: 'Generate an AI buyer summary' })
  async generateSummary(@Body() body: any) {
    return this.aiService.generateBuyerSummary(body);
  }

  @Post('generate-message')
  @ApiOperation({ summary: 'Generate a follow-up message for a buyer' })
  async generateMessage(@Body() body: { buyerData: any; channel: 'WhatsApp' | 'Email' }) {
    const msg = await this.aiService.generateFollowUpMessage(body.buyerData, body.channel);
    return { message: msg };
  }

  @Get('status')
  @ApiOperation({ summary: 'Check AI service status' })
  getStatus() {
    return {
      status: 'operational',
      providers: {
        openai: !!process.env.OPENAI_API_KEY,
        gemini: !!process.env.GEMINI_API_KEY,
        fallback: true,
      },
      queue: 'Redis required for async queue — running in sync mode',
    };
  }
}
