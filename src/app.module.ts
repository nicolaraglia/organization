import { Module } from '@nestjs/common';
import { OrganizationModule } from './organization/organization.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, OrganizationModule],
})
export class AppModule {}
