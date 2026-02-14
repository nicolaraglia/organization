import { Injectable, UnauthorizedException, ConflictException, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  @Inject(PrismaService)  
  private readonly prisma: PrismaService; 
  

  async signup(userData: Prisma.UserCreateInput): Promise<Partial<User>> {
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

  async login(email: string, password: string): Promise<Partial<User>> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const { password: pw, ...safeUser } = user;
    return safeUser;
  }
}