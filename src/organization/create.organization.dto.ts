import {
	IsIn,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
} from 'class-validator';

export const ORGANIZATION_TYPE_VALUES = [
	'COMPANY',
	'NON_PROFIT',
	'PUBLIC_ADMINISTRATION',
	'SCHOOL',
	'HEALTHCARE',
	'OTHER',
] as const;

export type OrganizationTypeDto = (typeof ORGANIZATION_TYPE_VALUES)[number];

export class CreateOrganizationDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(255)
	name: string;

	@IsOptional()
	@IsIn(ORGANIZATION_TYPE_VALUES)
	type?: OrganizationTypeDto;

	@IsOptional()
	@IsString()
	@MaxLength(500)
	address?: string;

	@IsOptional()
	@IsString()
	@MaxLength(50)
	vat?: string;
}
