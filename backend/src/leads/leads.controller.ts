import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Leads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  findAll(@Request() req) {
    return this.leadsService.findAll(req.user.orgId);
  }

  @Post()
  create(@Request() req, @Body() data: any) {
    return this.leadsService.create(req.user.orgId, data);
  }

  @Patch(':id/status')
  updateStatus(@Request() req, @Param('id') id: string, @Body('status') status: string) {
    return this.leadsService.updateStatus(id, req.user.orgId, status);
  }
}
