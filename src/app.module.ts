import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrganizationModule } from './organization/organization.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [OrganizationModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
