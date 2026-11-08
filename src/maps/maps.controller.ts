import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MapsService } from './maps.service.js';
import { CreateMapDto } from './dto/create-map.dto.js';
import { UpdateMapDto } from './dto/update-map.dto.js';

@Controller('maps')
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  @Post()
  create(@Body() createMapDto: CreateMapDto) {
    return this.mapsService.create(createMapDto);
  }

  @Get()
  findAll() {
    return this.mapsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mapsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMapDto: UpdateMapDto) {
    return this.mapsService.update(+id, updateMapDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mapsService.remove(+id);
  }
}
