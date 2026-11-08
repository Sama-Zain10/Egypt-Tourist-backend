import { Module } from '@nestjs/common';
import { AttractionService } from './attraction.service.js';
import { AttractionController } from './attraction.controller.js';

@Module({
  controllers: [AttractionController],
  providers: [AttractionService],
})
export class AttractionModule {}
