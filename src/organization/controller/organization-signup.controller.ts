import { Controller, Post, Body, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { OrganizationSignupService } from '../service/organization-signup.service';
import { SignupOrganizationDto } from '../dto/signup.organization.dto';

@Controller('organization/signup')
export class OrganizationSignupController {
  
  @Inject(OrganizationSignupService)
  private readonly signupService: OrganizationSignupService;

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signupDto: SignupOrganizationDto) {
    return this.signupService.signup(signupDto);
  }
}