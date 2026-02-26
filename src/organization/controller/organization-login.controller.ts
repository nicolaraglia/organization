import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginOrganizationDto } from '../dto/login-organization.dto';
import { OrganizationSignupService } from '../service/organization-signup.service';

@ApiTags('organization')
@Controller('organization/login')
export class OrganizationLoginController {
  @Inject(OrganizationSignupService)
  private readonly organizationSignupService: OrganizationSignupService;

  @ApiOperation({ summary: 'Organization admin login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post()
  async login(@Body() body: LoginOrganizationDto) {
    return this.organizationSignupService.login(body);
  }
}
