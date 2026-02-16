//is the update-user.dto.ts file, which defines the data transfer object for updating a user in the system. It includes properties such as email, password, firstName, lastName, organizationId, and role. All fields are optional, allowing partial updates. This DTO is used to validate and structure the data when a user is being updated through the API.         
import { IsEmail, IsOptional, IsString, IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'User password',
    example: 'SecurePassword123!',
    required: false,
  })
  @IsString()
  @IsOptional()
  password?: string;

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
