import { Injectable, UnauthorizedException, ConflictException, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './create-user.dto';
import { LoginUserDto } from './login-user.dto';

@Injectable()
export class UserService {
  @Inject(PrismaService)  
  private readonly prisma: PrismaService; 


  //this method in a way that can accept as input the CreateUserDto  
   async signup(userData: CreateUserDto): Promise<Partial<User>> {
    const existing = await this.prisma.user.findUnique({ where: { email: userData.email } });
    if (existing) throw new ConflictException('Email already in use');
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.prisma.user.create({
      data: { ...userData, password: hashedPassword }
    });
    // NON restituire la password
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async login(loginData: LoginUserDto): Promise<Partial<User>> {
    const user = await this.prisma.user.findUnique({ where: { email: loginData.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(loginData.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const { password: pw, ...safeUser } = user;
    return safeUser;
  }
}