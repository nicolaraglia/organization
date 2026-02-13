import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import {
  ORGANIZATION_TYPE_VALUES,
  OrganizationTypeDto,
} from './create.organization.dto';

export class UpdateOrganizationDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

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
