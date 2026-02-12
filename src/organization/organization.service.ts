import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Organization, Prisma } from '@prisma/client';

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.OrganizationCreateInput): Promise<Organization> {
    return this.prisma.organization.create({ data });
  }

  findAll(): Promise<Organization[]> {
    return this.prisma.organization.findMany();
  }

  findOne(id: number): Promise<Organization | null> {
    return this.prisma.organization.findUnique({ where: { id } });
  }

  update(id: number, data: Prisma.OrganizationUpdateInput): Promise<Organization> {
    return this.prisma.organization.update({ where: { id }, data });
  }

  remove(id: number): Promise<Organization> {
    return this.prisma.organization.delete({ where: { id } });
  }
}