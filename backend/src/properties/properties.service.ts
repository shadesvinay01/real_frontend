import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  async findAll(orgId: string) {
    return this.prisma.property.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async create(orgId: string, data: any) {
    return this.prisma.property.create({
      data: {
        organizationId: orgId,
        title: data.title,
        type: data.type || 'RESIDENTIAL',
        price: parseFloat(data.price),
        location: data.location,
        status: data.status || 'AVAILABLE',
        amenities: data.amenities || '',
      }
    });
  }
}
