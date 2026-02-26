import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationResetPasswordService } from './organization-resetpassword.service';
import { OrganizationRepository } from '../repository/organization.repository';
import { EmailService } from './email.service';

describe('OrganizationResetPasswordService', () => {
  let service: OrganizationResetPasswordService;

  const mockRepository = {
    findUserByEmail: jest.fn(),
    updateUserPasswordResetToken: jest.fn(),
    findUserByResetToken: jest.fn(),
    updateUserPassword: jest.fn(),
  };

  const mockEmailService = {
    sendEmail: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationResetPasswordService,
        {
          provide: OrganizationRepository,
          useValue: mockRepository,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<OrganizationResetPasswordService>(OrganizationResetPasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('initiatePasswordReset', () => {
    it('stores reset token and sends reset email', async () => {
      mockRepository.findUserByEmail.mockResolvedValue({
        id: 7,
        email: 'admin@acme.com',
      });
      mockRepository.updateUserPasswordResetToken.mockResolvedValue({});
      mockEmailService.sendEmail.mockResolvedValue(undefined);

      await service.initiatePasswordReset('admin@acme.com');

      expect(mockRepository.findUserByEmail).toHaveBeenCalledWith('admin@acme.com');
      expect(mockRepository.updateUserPasswordResetToken).toHaveBeenCalledTimes(1);
      expect(mockRepository.updateUserPasswordResetToken).toHaveBeenCalledWith(
        7,
        expect.any(String),
      );

      const savedToken = mockRepository.updateUserPasswordResetToken.mock.calls[0][1];
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        'admin@acme.com',
        'Password Reset Request',
        expect.stringContaining(`token=${savedToken}`),
      );
    });

    it('throws if user email does not exist', async () => {
      mockRepository.findUserByEmail.mockResolvedValue(null);

      await expect(service.initiatePasswordReset('missing@acme.com')).rejects.toThrow(
        'User with the provided email does not exist',
      );
      expect(mockRepository.updateUserPasswordResetToken).not.toHaveBeenCalled();
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled();
    });
  });

  describe('completePasswordReset', () => {
    it('updates password and invalidates token when token is valid', async () => {
      const validUser = {
        id: 9,
        passwordResetTokenExpiresAt: new Date(Date.now() + 60_000),
      };
      mockRepository.findUserByResetToken.mockResolvedValue(validUser);
      mockRepository.updateUserPassword.mockResolvedValue({});
      mockRepository.updateUserPasswordResetToken.mockResolvedValue({});

      await service.completePasswordReset('token-123', 'NewPass123!');

      expect(mockRepository.findUserByResetToken).toHaveBeenCalledWith('token-123');
      expect(mockRepository.updateUserPassword).toHaveBeenCalledTimes(1);
      expect(mockRepository.updateUserPassword).toHaveBeenCalledWith(
        9,
        expect.stringMatching(/^\$2[aby]\$/),
      );
      expect(mockRepository.updateUserPasswordResetToken).toHaveBeenCalledWith(9, null);
    });

    it('throws if token is invalid or expired', async () => {
      mockRepository.findUserByResetToken.mockResolvedValue(null);

      await expect(service.completePasswordReset('bad-token', 'NewPass123!')).rejects.toThrow(
        'Invalid or expired reset token',
      );
      expect(mockRepository.updateUserPassword).not.toHaveBeenCalled();
      expect(mockRepository.updateUserPasswordResetToken).not.toHaveBeenCalled();
    });
  });
});
