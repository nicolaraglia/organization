import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserPrismaMapper } from './user-prisma.mapper';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [UserService, UserPrismaMapper, PrismaService],
  controllers: [UserController]
})
export class UserModule {}
