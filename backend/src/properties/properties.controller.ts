import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Properties')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  findAll(@Request() req) {
    return this.propertiesService.findAll(req.user.orgId);
  }

  @Post()
  create(@Request() req, @Body() data: any) {
    return this.propertiesService.create(req.user.orgId, data);
  }
}
