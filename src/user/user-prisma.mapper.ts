//UserPrimsaMapper is responsible for mapping between User entities and Prisma User models
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';

@Injectable()   
export class UserPrismaMapper {
  toCreateData(dto: CreateUserDto): Prisma.UserCreateInput {
    const data: Prisma.UserCreateInput = {
      email: dto.email,
      password: dto.password,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role,
      organization: { connect: { id: dto.organizationId } },
    };

    return data;
  }

  toUpdateData(dto: UpdateUserDto): Prisma.UserUpdateInput {
    const data: Prisma.UserUpdateInput = {};

    if (dto.email !== undefined) {
      data.email = dto.email;
    }

    if (dto.password !== undefined) {
      data.password = dto.password;
    }

    if (dto.firstName !== undefined) {
      data.firstName = dto.firstName;
    }

    if (dto.lastName !== undefined) {
      data.lastName = dto.lastName;
    }

    if (dto.organizationId !== undefined) {
      data.organization = { connect: { id: dto.organizationId } };
    }

    if (dto.role !== undefined) {
      data.role = dto.role;
    }

    return data;
  }
}
