//implementation of organization restepassword test cases
import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationResetPasswordController } from './organization-resetpassword.controller';
import { OrganizationResetPasswordService } from '../service/organization-resetpassword.service';

describe('OrganizationResetPasswordController', () => {
  let controller: OrganizationResetPasswordController;
  let service: OrganizationResetPasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationResetPasswordController],
      providers: [
        {
          provide: OrganizationResetPasswordService,
          useValue: {
            initiatePasswordReset: jest.fn(),
            completePasswordReset: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrganizationResetPasswordController>(OrganizationResetPasswordController);
    service = module.get<OrganizationResetPasswordService>(OrganizationResetPasswordService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('initiatePasswordReset', () => {
    it('should call service to initiate password reset', async () => {
      const req = { body: { email: 'test@example.com' } } as any;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

      await controller.initiatePasswordReset(req, res);

      expect(service.initiatePasswordReset).toHaveBeenCalledWith('test@example.com');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Password reset initiated. Please check your email." });
    });
  });

  describe('completePasswordReset', () => {
    it('should call service to complete password reset', async () => {
      const req = { body: { token: 'test-token', newPassword: 'new-password' } } as any;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

      await controller.completePasswordReset(req, res);

      expect(service.completePasswordReset).toHaveBeenCalledWith('test-token', 'new-password');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Password reset successful." });
    });
  }); 
  
});
