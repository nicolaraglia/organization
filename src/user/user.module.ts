import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserPrismaMapper } from './user-prisma.mapper';

@Module({
  providers: [UserService, UserPrismaMapper],
  controllers: [UserController]
})
export class UserModule {}
