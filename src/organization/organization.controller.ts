import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './create.organization.dto';
import { UpdateOrganizationDto } from './update.organization.dto';

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationController {
  
  //@Inject OrganizationService with @Inject decorator as class property
  @Inject(OrganizationService)
  private readonly orgService: OrganizationService;
  
  @ApiOperation({ summary: 'Create a new organization' })
  @ApiResponse({ status: 201, description: 'Organization created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @Post()
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.orgService.create(createOrganizationDto);
  }

  @ApiOperation({ summary: 'Get all organizations' })
  @ApiResponse({ status: 200, description: 'List of all organizations' })
  @Get()
  findAll() {
    return this.orgService.findAll();
  }

  @ApiOperation({ summary: 'Get organization by ID' })
  @ApiParam({ name: 'id', description: 'Organization ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Organization found' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orgService.findOne(id);
  }

  @ApiOperation({ summary: 'Update organization' })
  @ApiParam({ name: 'id', description: 'Organization ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Organization updated successfully' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.orgService.update(id, updateOrganizationDto);
  }

  @ApiOperation({ summary: 'Delete organization' })
  @ApiParam({ name: 'id', description: 'Organization ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Organization deleted successfully' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orgService.remove(id);
  }
}