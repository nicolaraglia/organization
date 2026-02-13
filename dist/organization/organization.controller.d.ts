import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './create.organization.dto';
import { UpdateOrganizationDto } from './update.organization.dto';
export declare class OrganizationController {
    private readonly orgService;
    constructor(orgService: OrganizationService);
    create(createOrganizationDto: CreateOrganizationDto): Promise<{
        name: string;
        address: string | null;
        vat: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    findAll(): Promise<{
        name: string;
        address: string | null;
        vat: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }[]>;
    findOne(id: number): Promise<{
        name: string;
        address: string | null;
        vat: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    } | null>;
    update(id: number, updateOrganizationDto: UpdateOrganizationDto): Promise<{
        name: string;
        address: string | null;
        vat: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    remove(id: number): Promise<{
        name: string;
        address: string | null;
        vat: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
}
