import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { OrganizationPrismaMapper } from '../dto/organization-prisma.mapper';
import { OrganizationRepository } from '../repository/organization.repository';
import { OrganizationSignupService } from './organization-signup.service';
import { SignupOrganizationDto } from '../dto/signup.organization.dto';
import { ORGANIZATION_AUTH_PROVIDER } from '../provider/organization-auth.provider';

describe('OrganizationSignupService', () => {
  let service: OrganizationSignupService;

  const mockMapper = {
    toSignupData: jest.fn(),
  };

  const mockOrganizationRepository = {
    findUserByEmail: jest.fn(),
    createOrganizationWithAdmin: jest.fn(),
  };

  const mockEmailService = {
    sendWelcomeEmail: jest.fn(),
  };

  const mockAuthProvider = {
    login: jest.fn(),
  };

  const baseDto: SignupOrganizationDto = {
    name: 'Acme Corp',
    adminEmail: 'admin@acme.com',
    adminFirstName: 'John',
    adminLastName: 'Doe',
  };

  const mappedData = {
    organization: {
      name: 'Acme Corp',
      type: 'COMPANY',
    },
    adminUser: {
      email: 'admin@acme.com',
      firstName: 'John',
      lastName: 'Doe',
    },
  };

  const originalAppUrl = process.env.APP_URL;

  beforeEach(async () => {
    jest.clearAllMocks();
    process.env.APP_URL = originalAppUrl;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationSignupService,
        {
          provide: OrganizationPrismaMapper,
          useValue: mockMapper,
        },
        {
          provide: OrganizationRepository,
          useValue: mockOrganizationRepository,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
        {
          provide: ORGANIZATION_AUTH_PROVIDER,
          useValue: mockAuthProvider,
        },
      ],
    }).compile();

    service = module.get<OrganizationSignupService>(OrganizationSignupService);
  });

  afterAll(() => {
    process.env.APP_URL = originalAppUrl;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw ConflictException when admin email already exists', async () => {
    mockMapper.toSignupData.mockReturnValue(mappedData);
    mockOrganizationRepository.findUserByEmail.mockResolvedValue({ id: 1, email: mappedData.adminUser.email });

    try {
      await service.signup(baseDto);
      fail('Expected signup to throw ConflictException');
    } catch (error) {
      expect(error).toBeInstanceOf(ConflictException);
      expect((error as Error).message).toBe('Email already registered');
    }

    expect(mockOrganizationRepository.createOrganizationWithAdmin).not.toHaveBeenCalled();
    expect(mockEmailService.sendWelcomeEmail).not.toHaveBeenCalled();
  });

  it('should create organization and send welcome email on successful signup', async () => {
    process.env.APP_URL = 'https://app.flexqueue.com';
    mockMapper.toSignupData.mockReturnValue(mappedData);
    mockOrganizationRepository.findUserByEmail.mockResolvedValue(null);
    mockOrganizationRepository.createOrganizationWithAdmin.mockResolvedValue({
      organization: { id: 11 },
      user: { id: 22 },
    });
    jest.spyOn(service as any, 'generateTemporaryPassword').mockReturnValue('Temp#123456789');
    jest.spyOn(service as any, 'hashPassword').mockResolvedValue('hashed-password');

    const result = await service.signup(baseDto);

    expect(mockOrganizationRepository.createOrganizationWithAdmin).toHaveBeenCalledWith({
      organization: mappedData.organization,
      adminUser: mappedData.adminUser,
      passwordHash: 'hashed-password',
    });
    expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith({
      email: mappedData.adminUser.email,
      firstName: mappedData.adminUser.firstName,
      organizationName: mappedData.organization.name,
      temporaryPassword: 'Temp#123456789',
      loginUrl: 'https://app.flexqueue.com/login',
    });
    expect(result).toEqual({
      organizationId: 11,
      userId: 22,
      message: 'Organization registered successfully. Please check your email for login credentials.',
    });
  });

  it('should throw generic error when persistence fails', async () => {
    mockMapper.toSignupData.mockReturnValue(mappedData);
    mockOrganizationRepository.findUserByEmail.mockResolvedValue(null);
    mockOrganizationRepository.createOrganizationWithAdmin.mockRejectedValue(new Error('db down'));
    jest.spyOn(service as any, 'generateTemporaryPassword').mockReturnValue('Temp#123456789');
    jest.spyOn(service as any, 'hashPassword').mockResolvedValue('hashed-password');
    jest.spyOn(console, 'error').mockImplementation(() => undefined);

    await expect(service.signup(baseDto)).rejects.toThrow(
      'Failed to register organization. Please try again.',
    );
    expect(mockEmailService.sendWelcomeEmail).not.toHaveBeenCalled();
  });

  it('should delegate login to configured auth provider', async () => {
    const loginData = {
      email: 'admin@acme.com',
      password: 'password',
    };
    const authResult = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      tokenType: 'Bearer' as const,
      expiresIn: 900,
      refreshExpiresIn: 604800,
      user: {
        id: 1,
        email: loginData.email,
        role: 'ADMIN',
        organizationId: 10,
      },
    };
    mockAuthProvider.login.mockResolvedValue(authResult);

    const result = await service.login(loginData);

    expect(mockAuthProvider.login).toHaveBeenCalledWith(loginData);
    expect(result).toEqual(authResult);
  });

  it('should propagate auth provider errors in login', async () => {
    const loginData = {
      email: 'missing@acme.com',
      password: 'password',
    };
    const error = new Error('Invalid credentials');
    mockAuthProvider.login.mockRejectedValue(error);

    await expect(service.login(loginData)).rejects.toThrow('Invalid credentials');
    expect(mockAuthProvider.login).toHaveBeenCalledWith(loginData);
  });
});
