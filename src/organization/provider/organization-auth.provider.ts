import { User } from '@prisma/client';
import { LoginOrganizationDto } from '../dto/login-organization.dto';

export const ORGANIZATION_AUTH_PROVIDER = Symbol('ORGANIZATION_AUTH_PROVIDER');

export type OrganizationLoginResult = {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  refreshExpiresIn: number;
  user: Partial<User>;
};

export interface OrganizationAuthProvider {
  login(loginData: LoginOrganizationDto): Promise<OrganizationLoginResult>;
}
