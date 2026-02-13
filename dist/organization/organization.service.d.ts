import { PrismaService } from '../prisma/prisma.service';
import { Organization } from '@prisma/client';
import { CreateOrganizationDto } from './create.organization.dto';
import { UpdateOrganizationDto } from './update.organization.dto';
export declare class OrganizationService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateOrganizationDto): Promise<Organization>;
    findAll(): Promise<Organization[]>;
    findOne(id: number): Promise<Organization | null>;
    update(id: number, data: UpdateOrganizationDto): Promise<Organization>;
    remove(id: number): Promise<Organization>;
}
