import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Organization } from '@prisma/client';
import { CreateOrganizationDto } from './create.organization.dto';
import { UpdateOrganizationDto } from './update.organization.dto';
import { OrganizationPrismaMapper } from './organization-prisma.mapper';

@Injectable()
export class OrganizationService {

  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  @Inject(OrganizationPrismaMapper)
  private readonly organizationPrismaMapper: OrganizationPrismaMapper;
  
  create(data: CreateOrganizationDto): Promise<Organization> {
    const prismaData = this.organizationPrismaMapper.toCreateData(data);
    return this.prisma.organization.create({ data: prismaData });
  }

  findAll(): Promise<Organization[]> {
    return this.prisma.organization.findMany();
  }

  findOne(id: number): Promise<Organization | null> {
    return this.prisma.organization.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateOrganizationDto): Promise<Organization> {
    const prismaData = this.organizationPrismaMapper.toUpdateData(data);
    return this.prisma.organization.update({ where: { id }, data: prismaData });
  }

  remove(id: number): Promise<Organization> {
    return this.prisma.organization.delete({ where: { id } });
  }
}