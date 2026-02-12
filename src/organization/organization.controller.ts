import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { OrganizationService } from './organization.service';

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly orgService: OrganizationService) {}

  @Post()
  create(@Body() data: any) {
    return this.orgService.create(data);
  }

  @Get()
  findAll() {
    return this.orgService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orgService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.orgService.update(Number(id), data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orgService.remove(Number(id));
  }
}