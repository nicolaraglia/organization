import { PrismaService } from '../prisma/prisma.service';
import { Organization, Prisma } from '@prisma/client';
export declare class OrganizationService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.OrganizationCreateInput): Promise<Organization>;
    findAll(): Promise<Organization[]>;
    findOne(id: number): Promise<Organization | null>;
    update(id: number, data: Prisma.OrganizationUpdateInput): Promise<Organization>;
    remove(id: number): Promise<Organization>;
}
