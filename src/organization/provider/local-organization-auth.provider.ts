import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginOrganizationDto } from '../dto/login-organization.dto';
import {
  OrganizationAuthProvider,
  OrganizationLoginResult,
} from './organization-auth.provider';
import { OrganizationRepository } from '../repository/organization.repository';
import { OrganizationTokenService } from '../service/organization-token.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LocalOrganizationAuthProvider implements OrganizationAuthProvider {
  @Inject(OrganizationRepository)
  private readonly organizationRepository: OrganizationRepository;

  @Inject(OrganizationTokenService)
  private readonly tokenService: OrganizationTokenService;

  async login(loginData: LoginOrganizationDto): Promise<OrganizationLoginResult> {
    const user = await this.organizationRepository.findUserByEmail(loginData.email);
    if (!user || user.role !== 'ADMIN') {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(loginData.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password, ...safeUser } = user;
    const accessToken = this.tokenService.issueAccessToken(user);
    const refreshToken = this.tokenService.issueRefreshToken(user);

    return {
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
      tokenType: 'Bearer',
      expiresIn: accessToken.expiresIn,
      refreshExpiresIn: refreshToken.expiresIn,
      user: safeUser,
    };
  }
}
