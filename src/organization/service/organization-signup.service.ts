import { Injectable, ConflictException, Inject } from '@nestjs/common';
import { OrganizationPrismaMapper } from '../dto/organization-prisma.mapper';
import { SignupOrganizationDto } from '../dto/signup.organization.dto';
import { EmailService } from './email.service';
import { OrganizationRepository } from '../repository/organization.repository';
import { LoginOrganizationDto } from '../dto/login-organization.dto';
import {
  ORGANIZATION_AUTH_PROVIDER,
  OrganizationAuthProvider,
  OrganizationLoginResult,
} from '../provider/organization-auth.provider';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class OrganizationSignupService {
@Inject(OrganizationPrismaMapper)
private readonly mapper: OrganizationPrismaMapper
@Inject(EmailService)
private readonly emailService: EmailService;
@Inject(OrganizationRepository)
private readonly organizationRepository: OrganizationRepository;
@Inject(ORGANIZATION_AUTH_PROVIDER)
private readonly authProvider: OrganizationAuthProvider;
  

  async signup(dto: SignupOrganizationDto) {
    const { organization, adminUser } = this.mapper.toSignupData(dto);

    // Check if email already exists
    const existingUser = await this.organizationRepository.findUserByEmail(adminUser.email);

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Generate temporary password
    const temporaryPassword = this.generateTemporaryPassword();
    const passwordHash = await this.hashPassword(temporaryPassword);

    try {
      const result = await this.organizationRepository.createOrganizationWithAdmin({
        organization,
        adminUser,
        passwordHash,
      });

      // Send welcome email with credentials
      const loginUrl = `${process.env.APP_URL || 'http://localhost:3000'}/login`;
      
      await this.emailService.sendWelcomeEmail({
        email: adminUser.email,
        firstName: adminUser.firstName,
        organizationName: organization.name,
        temporaryPassword,
        loginUrl,
      });

      return {
        organizationId: result.organization.id,
        userId: result.user.id,
        message: 'Organization registered successfully. Please check your email for login credentials.',
      };
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error('Failed to register organization. Please try again.');
    }
  }

  async login(loginData: LoginOrganizationDto): Promise<OrganizationLoginResult> {
    return this.authProvider.login(loginData);
  }

  private generateTemporaryPassword(): string {
    const length = 16;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    const randomBytes = crypto.randomBytes(length);
    
    for (let i = 0; i < length; i++) {
      password += charset[randomBytes[i] % charset.length];
    }
    
    return password;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}
