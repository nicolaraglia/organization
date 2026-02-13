import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Organization } from '@prisma/client';
import { CreateOrganizationDto } from './create.organization.dto';
import { UpdateOrganizationDto } from './update.organization.dto';

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateOrganizationDto): Promise<Organization> {
    return this.prisma.organization.create({ data });
  }

  findAll(): Promise<Organization[]> {
    return this.prisma.organization.findMany();
  }

  findOne(id: number): Promise<Organization | null> {
    return this.prisma.organization.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateOrganizationDto): Promise<Organization> {
    return this.prisma.organization.update({ where: { id }, data });
  }

  remove(id: number): Promise<Organization> {
    return this.prisma.organization.delete({ where: { id } });
  }
}