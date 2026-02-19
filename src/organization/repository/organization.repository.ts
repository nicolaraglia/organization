import { Injectable, Inject } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

type AdminUserData = {
  email: string;
  firstName: string;
  lastName: string;
};

@Injectable()
export class OrganizationRepository {
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async createOrganizationWithAdmin(params: {
    organization: Prisma.OrganizationCreateInput;
    adminUser: AdminUserData;
    passwordHash: string;
  }) {
    const { organization, adminUser, passwordHash } = params;

    return this.prisma.$transaction(async (tx) => {
      const createdOrg = await tx.organization.create({
        data: organization,
      });

      const createdUser = await tx.user.create({
        data: {
          email: adminUser.email,
          firstName: adminUser.firstName,
          lastName: adminUser.lastName,
          password: passwordHash,
          organizationId: createdOrg.id,
          role: 'ADMIN',
        },
      });

      return { organization: createdOrg, user: createdUser };
    });
  }
}
