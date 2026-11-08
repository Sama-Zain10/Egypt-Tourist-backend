import { Module } from '@nestjs/common';
import { MapsService } from './maps.service.js';
import { MapsController } from './maps.controller.js';

@Module({
  controllers: [MapsController],
  providers: [MapsService],
})
export class MapsModule {}
