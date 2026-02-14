//is the update-user.dto.ts file, which defines the data transfer object for updating a user in the system. It includes properties such as email, password, firstName, lastName, organizationId, and role. All fields are optional, allowing partial updates. This DTO is used to validate and structure the data when a user is being updated through the API.         
import { IsEmail, IsOptional, IsString, IsInt, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

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
