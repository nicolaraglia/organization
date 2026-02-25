import { Injectable, Inject } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { log } from 'console';

type AdminUserData = {
  email: string;
  firstName: string;
  lastName: string;
};

@Injectable()
export class OrganizationRepository {
  updateUserPassword(id: number, hashedPassword: string) {
      // This method updates the user's password in the database with the newly hashed password.
      return this.prisma.user.update({
        where: { id },
        data: {
          password: hashedPassword,
        },
      });   
  }
  findUserByResetToken(token: string) {
      // This method retrieves a user based on the provided password reset token, ensuring that the token is still valid (i.e., it has not expired).
      return this.prisma.user.findFirst({
        where: {
          passwordResetToken: token,
          passwordResetTokenExpiresAt: {
            gt: new Date(),
          },
        },
      }); 
  }
   
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  updateUserPasswordResetToken(id: number , uuid: string | null) {
      // This method updates the user's record with the generated password reset token and its expiration time.
      return this.prisma.user.update({
        where: { id },
        data: {
          passwordResetToken: uuid,
          passwordResetTokenExpiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour from now
        },
      });   
   }


  async findUserByEmail(email: string): Promise<User | null> {
    log(`Searching for user with email: ${email}`);
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
