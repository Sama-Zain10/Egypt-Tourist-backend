import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GovernoratesService } from './governorates.service.js';
import { CreateGovernorateDto } from './dto/create-governorate.dto.js';
import { UpdateGovernorateDto } from './dto/update-governorate.dto.js';

@Controller('governorates')
export class GovernoratesController {
  constructor(private readonly governoratesService: GovernoratesService) {}

  @Post()
  create(@Body() createGovernorateDto: CreateGovernorateDto) {
    return this.governoratesService.create(createGovernorateDto);
  }

  @Get()
  findAll() {
    return this.governoratesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.governoratesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGovernorateDto: UpdateGovernorateDto) {
    return this.governoratesService.update(+id, updateGovernorateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.governoratesService.remove(+id);
  }
}
