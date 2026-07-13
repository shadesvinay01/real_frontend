import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LeadEngineService } from './lead-engine.service';
import { SubmitWizardDto } from './dto/submit-wizard.dto';

@ApiTags('Lead Engine')
@Controller('lead-engine')
export class LeadEngineController {
  constructor(private readonly leadEngineService: LeadEngineService) {}

  @Post('submit')
  @ApiOperation({ summary: 'Process website wizard submission' })
  submitWizard(@Body(new ValidationPipe({ transform: true })) dto: SubmitWizardDto) {
    return this.leadEngineService.processSubmission(dto);
  }
}
