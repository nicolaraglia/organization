import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    signup(userData: Prisma.UserCreateInput): Promise<Partial<User>>;
    login(email: string, password: string): Promise<Partial<User>>;
}
