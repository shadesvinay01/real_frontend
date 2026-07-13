import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post(':leadId')
  create(@Param('leadId') leadId: string, @Body('content') content: string) {
    return this.notesService.create(leadId, content);
  }

  @Get(':leadId')
  getByLead(@Param('leadId') leadId: string) {
    return this.notesService.getByLead(leadId);
  }
}
