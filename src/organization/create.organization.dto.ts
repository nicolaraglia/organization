import {
	IsIn,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ORGANIZATION_TYPE_VALUES } from './organization.constants';


export class CreateOrganizationDto {
	@ApiProperty({
		description: 'Organization name',
		example: 'Acme Corp',
		maxLength: 255,
	})
	@IsString()
	@IsNotEmpty()
	@MaxLength(255)
	name: string;

	@ApiProperty({
		description: 'Organization type',
		enum: ORGANIZATION_TYPE_VALUES,
		required: false,
	})
	@IsOptional()
	@IsIn(ORGANIZATION_TYPE_VALUES)
	type?: (typeof ORGANIZATION_TYPE_VALUES)[number];

	@ApiProperty({
		description: 'Organization address',
		example: '123 Main St, New York, NY 10001',
		maxLength: 500,
		required: false,
	})
	@IsOptional()
	@IsString()
	@MaxLength(500)
	address?: string;

	@ApiProperty({
		description: 'VAT number',
		example: 'IT12345678901',
		maxLength: 50,
		required: false,
	})
	@IsOptional()
	@IsString()
	@MaxLength(50)
	vat?: string;
}
