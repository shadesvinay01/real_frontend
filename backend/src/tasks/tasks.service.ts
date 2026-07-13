import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(orgId: string) {
    return this.prisma.task.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async create(orgId: string, data: any) {
    return this.prisma.task.create({
      data: {
        organizationId: orgId,
        title: data.title,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        priority: data.priority || 'MEDIUM',
        status: data.status || 'PENDING',
        type: data.type || 'CALL',
      }
    });
  }

  async updateStatus(id: string, orgId: string, status: string) {
    const task = await this.prisma.task.findFirst({
      where: { id }
    });

    if (!task || task.organizationId !== orgId) {
      throw new NotFoundException('Task not found');
    }

    return this.prisma.task.update({
      where: { id },
      data: { status }
    });
  }
}
