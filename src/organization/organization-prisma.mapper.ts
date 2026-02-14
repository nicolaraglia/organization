import { Injectable } from '@nestjs/common';
import { OrganizationType, Prisma } from '@prisma/client';
import { CreateOrganizationDto } from './create.organization.dto';
import { UpdateOrganizationDto } from './update.organization.dto';

@Injectable()
export class OrganizationPrismaMapper {
  mapOrganizationType(type?: string): OrganizationType | undefined {
    if (!type) {
      return undefined;
    }

    switch (type) {
      case 'COMPANY':
        return OrganizationType.COMPANY;
      case 'NON_PROFIT':
        return OrganizationType.NON_PROFIT;
      case 'PUBLIC_ADMINISTRATION':
        return OrganizationType.PUBLIC_ADMINISTRATION;
      case 'SCHOOL':
        return OrganizationType.SCHOOL;
      case 'HEALTHCARE':
        return OrganizationType.HEALTHCARE;
      case 'OTHER':
        return OrganizationType.OTHER;
      default:
        return undefined;
    }
  }

  toCreateData(dto: CreateOrganizationDto): Prisma.OrganizationCreateInput {
    const organizationType = this.mapOrganizationType(dto.type);

    return {
      name: dto.name,
      address: dto.address,
      vat: dto.vat,
      ...(organizationType ? { type: organizationType } : {}),
    };
  }

  toUpdateData(dto: UpdateOrganizationDto): Prisma.OrganizationUpdateInput {
    const organizationType = this.mapOrganizationType(dto.type);
    const data: Prisma.OrganizationUpdateInput = {};

    if (dto.name !== undefined) {
      data.name = dto.name;
    }

    if (organizationType !== undefined) {
      data.type = organizationType;
    }

    if (dto.address !== undefined) {
      data.address = dto.address;
    }

    if (dto.vat !== undefined) {
      data.vat = dto.vat;
    }

    return data;
  }
}
