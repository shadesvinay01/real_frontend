import { Module } from '@nestjs/common';
import { LeadEngineController } from './lead-engine.controller';
import { LeadEngineService } from './lead-engine.service';
import { AiModule } from '../ai/ai.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, AiModule],
  controllers: [LeadEngineController],
  providers: [LeadEngineService],
})
export class LeadEngineModule {}
