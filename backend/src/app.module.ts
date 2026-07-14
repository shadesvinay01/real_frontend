import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { LeadsModule } from './leads/leads.module';
import { PropertiesModule } from './properties/properties.module';
import { TasksModule } from './tasks/tasks.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { CustomersModule } from './customers/customers.module';
import { NotesModule } from './notes/notes.module';
import { BuyersModule } from './buyers/buyers.module';
import { AiModule } from './ai/ai.module';
import { LeadEngineModule } from './lead-engine/lead-engine.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    AuthModule, PrismaModule, LeadsModule, PropertiesModule,
    TasksModule, AnalyticsModule, CustomersModule, NotesModule,
    BuyersModule, AiModule, LeadEngineModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

