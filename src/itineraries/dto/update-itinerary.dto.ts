import { PartialType } from '@nestjs/mapped-types';
import { CreateItineraryDto } from './create-itinerary.dto.js';

export class UpdateItineraryDto extends PartialType(CreateItineraryDto) {}
