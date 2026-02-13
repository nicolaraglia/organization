import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateOrganizationDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(255)
	name: string;

	@IsOptional()
	@IsString()
	@MaxLength(500)
	address?: string;

	@IsOptional()
	@IsString()
	@MaxLength(50)
	vat?: string;
}
