import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async create(leadId: string, content: string) {
    return this.prisma.note.create({
      data: { leadId, content },
    });
  }

  async getByLead(leadId: string) {
    return this.prisma.note.findMany({
      where: { leadId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
