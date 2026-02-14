//is the create-user.dto.ts file, which defines the data transfer object for creating a user in the system. It includes properties such as email, password, firstName, lastName, organizationId, and role. The email and password fields are required, while the others are optional. This DTO is used to validate and structure the data when a new user is being created through the API.
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsInt()
  @IsOptional()
  organizationId?: number;

  @IsString()
  @IsNotEmpty()
  role: string;
}   