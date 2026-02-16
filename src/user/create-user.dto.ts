//is the create-user.dto.ts file, which defines the data transfer object for creating a user in the system. It includes properties such as email, password, firstName, lastName, organizationId, and role. The email and password fields are required, while the others are optional. This DTO is used to validate and structure the data when a new user is being created through the API.
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'SecurePassword123!',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    required: false,
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    description: 'Organization ID',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  organizationId?: number;

  @ApiProperty({
    description: 'User role',
    example: 'admin',
  })
  @IsString()
  @IsNotEmpty()
  role: string;
}   