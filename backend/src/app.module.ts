import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { LeadsModule } from './leads/leads.module';
import { PropertiesModule } from './properties/properties.module';

@Module({
  imports: [AuthModule, PrismaModule, LeadsModule, PropertiesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
