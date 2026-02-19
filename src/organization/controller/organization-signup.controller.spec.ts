import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationSignupController } from './organization-signup.controller';
import { OrganizationSignupService } from  '../service/organization-signup.service';
import { SignupOrganizationDto } from  '../dto/signup.organization.dto';

describe('OrganizationSignupController', () => {
  let controller: OrganizationSignupController;
  let service: OrganizationSignupService;

  const mockOrganizationSignupService = {
    signup: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationSignupController],
      providers: [
        {
          provide: OrganizationSignupService,
          useValue: mockOrganizationSignupService,
        },
      ],
    }).compile();

    controller = module.get<OrganizationSignupController>(OrganizationSignupController);
    service = module.get<OrganizationSignupService>(OrganizationSignupService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.signup with dto and return result', async () => {
    const dto: SignupOrganizationDto = {
      name: 'Acme Corp',
      adminEmail: 'admin@acme.com',
      adminFirstName: 'John',
      adminLastName: 'Doe',
    };

    const expectedResult = {
      organizationId: 1,
      userId: 10,
      message:
        'Organization registered successfully. Please check your email for login credentials.',
    };

    mockOrganizationSignupService.signup.mockResolvedValue(expectedResult);

    await expect(controller.signup(dto)).resolves.toEqual(expectedResult);
    expect(service.signup).toHaveBeenCalledWith(dto);
    expect(service.signup).toHaveBeenCalledTimes(1);
  });

  it('should propagate errors from service.signup', async () => {
    const dto: SignupOrganizationDto = {
      name: 'Acme Corp',
      adminEmail: 'admin@acme.com',
      adminFirstName: 'John',
      adminLastName: 'Doe',
    };

    const error = new Error('Failed to register organization. Please try again.');
    mockOrganizationSignupService.signup.mockRejectedValue(error);

    await expect(controller.signup(dto)).rejects.toThrow(error.message);
    expect(service.signup).toHaveBeenCalledWith(dto);
  });

  it('should pass full dto (with optional fields) to service.signup', async () => {
    const dto: SignupOrganizationDto = {
      name: 'Acme Corp',
      type: 'COMPANY',
      address: '123 Main St, New York',
      vat: 'IT12345678901',
      adminEmail: 'admin@acme.com',
      adminFirstName: 'John',
      adminLastName: 'Doe',
    };

    const expectedResult = {
      organizationId: 2,
      userId: 20,
      message:
        'Organization registered successfully. Please check your email for login credentials.',
    };

    mockOrganizationSignupService.signup.mockResolvedValue(expectedResult);

    await controller.signup(dto);

    expect(service.signup).toHaveBeenCalledWith(dto);
    expect(service.signup).toHaveBeenCalledTimes(1);
  });

  it('should forward each signup call with its own dto', async () => {
    const firstDto: SignupOrganizationDto = {
      name: 'Acme Corp',
      adminEmail: 'admin@acme.com',
      adminFirstName: 'John',
      adminLastName: 'Doe',
    };

    const secondDto: SignupOrganizationDto = {
      name: 'Globex',
      adminEmail: 'owner@globex.com',
      adminFirstName: 'Jane',
      adminLastName: 'Smith',
    };

    mockOrganizationSignupService.signup.mockResolvedValue({
      organizationId: 1,
      userId: 10,
      message: 'ok',
    });

    await controller.signup(firstDto);
    await controller.signup(secondDto);

    expect(service.signup).toHaveBeenNthCalledWith(1, firstDto);
    expect(service.signup).toHaveBeenNthCalledWith(2, secondDto);
    expect(service.signup).toHaveBeenCalledTimes(2);
  });
});
