import { OrganizationService } from './organization.service';
export declare class OrganizationController {
    private readonly orgService;
    constructor(orgService: OrganizationService);
    create(data: any): Promise<{
        name: string;
        id: number;
        address: string | null;
        vat: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    findAll(): Promise<{
        name: string;
        id: number;
        address: string | null;
        vat: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        id: number;
        address: string | null;
        vat: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    } | null>;
    update(id: string, data: any): Promise<{
        name: string;
        id: number;
        address: string | null;
        vat: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: number;
        address: string | null;
        vat: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
}
