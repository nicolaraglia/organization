import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LocalOrganizationAuthProvider } from './local-organization-auth.provider';
import { OrganizationRepository } from '../repository/organization.repository';
import { OrganizationTokenService } from '../service/organization-token.service';

describe('LocalOrganizationAuthProvider', () => {
  let provider: LocalOrganizationAuthProvider;

  const mockOrganizationRepository = {
    findUserByEmail: jest.fn(),
  };

  const mockTokenService = {
    issueAccessToken: jest.fn(),
    issueRefreshToken: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalOrganizationAuthProvider,
        {
          provide: OrganizationRepository,
          useValue: mockOrganizationRepository,
        },
        {
          provide: OrganizationTokenService,
          useValue: mockTokenService,
        },
      ],
    }).compile();

    provider = module.get<LocalOrganizationAuthProvider>(LocalOrganizationAuthProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('should return access and refresh tokens for valid admin credentials', async () => {
    const loginData = {
      email: 'admin@acme.com',
      password: 'password',
    };
    const user = {
      id: 1,
      email: 'admin@acme.com',
      password: '$2b$10$qm9a/TVvuYT/ElpM6QIcUunakWJSU8LvL2C6GvD1D1iqy.K5fCN2W',
      role: 'ADMIN',
      organizationId: 10,
    };
    mockOrganizationRepository.findUserByEmail.mockResolvedValue(user);
    mockTokenService.issueAccessToken.mockReturnValue({
      token: 'access-token',
      expiresIn: 900,
    });
    mockTokenService.issueRefreshToken.mockReturnValue({
      token: 'refresh-token',
      expiresIn: 604800,
    });

    const result = await provider.login(loginData);

    expect(mockOrganizationRepository.findUserByEmail).toHaveBeenCalledWith(loginData.email);
    expect(mockTokenService.issueAccessToken).toHaveBeenCalledWith(user);
    expect(mockTokenService.issueRefreshToken).toHaveBeenCalledWith(user);
    expect(result).toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      tokenType: 'Bearer',
      expiresIn: 900,
      refreshExpiresIn: 604800,
      user: {
        id: 1,
        email: 'admin@acme.com',
        role: 'ADMIN',
        organizationId: 10,
      },
    });
  });

  it('should throw UnauthorizedException when user does not exist', async () => {
    mockOrganizationRepository.findUserByEmail.mockResolvedValue(null);

    await expect(
      provider.login({ email: 'missing@acme.com', password: 'password' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when user is not admin', async () => {
    mockOrganizationRepository.findUserByEmail.mockResolvedValue({
      id: 2,
      email: 'staff@acme.com',
      password: '$2b$10$qm9a/TVvuYT/ElpM6QIcUunakWJSU8LvL2C6GvD1D1iqy.K5fCN2W',
      role: 'STAFF',
      organizationId: 10,
    });

    await expect(
      provider.login({ email: 'staff@acme.com', password: 'password' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when password is invalid', async () => {
    mockOrganizationRepository.findUserByEmail.mockResolvedValue({
      id: 1,
      email: 'admin@acme.com',
      password: '$2b$10$qm9a/TVvuYT/ElpM6QIcUunakWJSU8LvL2C6GvD1D1iqy.K5fCN2W',
      role: 'ADMIN',
      organizationId: 10,
    });

    await expect(provider.login({ email: 'admin@acme.com', password: 'wrong' })).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
