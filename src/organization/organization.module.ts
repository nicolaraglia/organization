// src/organization/organization.module.ts
import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { PrismaService } from '../prisma/prisma.service';
import { OrganizationPrismaMapper } from './organization-prisma.mapper';

@Module({
  controllers: [OrganizationController],
  providers: [OrganizationService, PrismaService, OrganizationPrismaMapper],
})
export class OrganizationModule {}