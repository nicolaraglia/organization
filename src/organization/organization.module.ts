import { Module } from '@nestjs/common';

import { OrganizationSignupController } from './controller/organization-signup.controller';
import { OrganizationLoginController } from './controller/organization-login.controller';
import { OrganizationResetPasswordController } from './controller/organization-resetpassword.controller';
import { OrganizationSignupService } from './service/organization-signup.service';
import { OrganizationResetPasswordService } from './service/organization-resetpassword.service';
import { OrganizationPrismaMapper } from './dto/organization-prisma.mapper';
import { EmailService } from './service/email.service';
import { OrganizationRepository } from './repository/organization.repository';
import { LocalOrganizationAuthProvider } from './provider/local-organization-auth.provider';
import { ORGANIZATION_AUTH_PROVIDER } from './provider/organization-auth.provider';
import { OrganizationTokenService } from './service/organization-token.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [
    OrganizationSignupController,
    OrganizationLoginController,
    OrganizationResetPasswordController,
  ],
  providers: [
    
    OrganizationSignupService,
    OrganizationResetPasswordService,
    OrganizationRepository,
    OrganizationTokenService,
    LocalOrganizationAuthProvider,
    {
      provide: ORGANIZATION_AUTH_PROVIDER,
      useExisting: LocalOrganizationAuthProvider,
    },
    OrganizationPrismaMapper,
    EmailService,
  ],
  exports: [OrganizationSignupService],
})
export class OrganizationModule {}
