import { Injectable } from '@nestjs/common';
import { OrganizationType, Prisma } from '@prisma/client';
import { SignupOrganizationDto } from './signup.organization.dto';


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

  toSignupData(dto: SignupOrganizationDto): {
    organization: Prisma.OrganizationCreateInput;
    adminUser: {
      email: string;
      firstName: string;
      lastName: string;
    };
  } {
    const organizationType = this.mapOrganizationType(dto.type);

    return {
      organization: {
        name: dto.name,
        address: dto.address,
        vat: dto.vat,
        ...(organizationType ? { type: organizationType } : {}),
      },
      adminUser: {
        email: dto.adminEmail,
        firstName: dto.adminFirstName,
        lastName: dto.adminLastName,
      },
    };
  }

}
