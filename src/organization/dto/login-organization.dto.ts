import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginOrganizationDto {
  @ApiProperty({
    description: 'Organization admin email address',
    example: 'admin@acme.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Organization admin password',
    example: 'SecurePassword123!',
  })
  @IsNotEmpty()
  password: string;
}
