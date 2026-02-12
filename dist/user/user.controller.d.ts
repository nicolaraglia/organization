import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    signup(body: {
        email: string;
        password: string;
        firstName?: string;
        lastName?: string;
        organizationId?: number;
        role?: string;
    }): Promise<Partial<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        email: string;
        password: string;
        firstName: string | null;
        lastName: string | null;
        role: string;
        organizationId: number | null;
    }>>;
    login(body: {
        email: string;
        password: string;
    }): Promise<Partial<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        email: string;
        password: string;
        firstName: string | null;
        lastName: string | null;
        role: string;
        organizationId: number | null;
    }>>;
}
