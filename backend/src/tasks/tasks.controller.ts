import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Request() req) {
    return this.tasksService.findAll(req.user.orgId);
  }

  @Post()
  create(@Request() req, @Body() data: any) {
    return this.tasksService.create(req.user.orgId, data);
  }

  @Patch(':id/status')
  updateStatus(@Request() req, @Param('id') id: string, @Body('status') status: string) {
    return this.tasksService.updateStatus(id, req.user.orgId, status);
  }
}
