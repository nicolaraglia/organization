import { Test, TestingModule } from '@nestjs/testing';
import { LoginOrganizationDto } from  '../dto/login-organization.dto';
import { OrganizationLoginController } from   './organization-login.controller'; 
import { OrganizationSignupService } from  '../service/organization-signup.service';

describe('OrganizationLoginController', () => {
  let controller: OrganizationLoginController;
  let service: OrganizationSignupService;

  const mockOrganizationSignupService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationLoginController],
      providers: [
        {
          provide: OrganizationSignupService,
          useValue: mockOrganizationSignupService,
        },
      ],
    }).compile();

    controller = module.get<OrganizationLoginController>(OrganizationLoginController);
    service = module.get<OrganizationSignupService>(OrganizationSignupService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.login with dto and return result', async () => {
    const dto: LoginOrganizationDto = {
      email: 'admin@acme.com',
      password: 'SecurePassword123!',
    };
    const expectedResult = {
      id: 1,
      email: 'admin@acme.com',
      role: 'ADMIN',
      organizationId: 10,
    };

    mockOrganizationSignupService.login.mockResolvedValue(expectedResult);

    await expect(controller.login(dto)).resolves.toEqual(expectedResult);
    expect(service.login).toHaveBeenCalledWith(dto);
    expect(service.login).toHaveBeenCalledTimes(1);
  });

  it('should propagate errors from service.login', async () => {
    const dto: LoginOrganizationDto = {
      email: 'admin@acme.com',
      password: 'wrong',
    };
    const error = new Error('Invalid credentials');
    mockOrganizationSignupService.login.mockRejectedValue(error);

    await expect(controller.login(dto)).rejects.toThrow(error.message);
    expect(service.login).toHaveBeenCalledWith(dto);
  });
});
