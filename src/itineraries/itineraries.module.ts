import { Module } from '@nestjs/common';
import { ItinerariesService } from './itineraries.service.js';
import { ItinerariesController } from './itineraries.controller.js';

@Module({
  controllers: [ItinerariesController],
  providers: [ItinerariesService],
})
export class ItinerariesModule {}
