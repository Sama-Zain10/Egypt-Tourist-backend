import { PartialType } from '@nestjs/mapped-types';
import { CreateAttractionDto } from './create-attraction.dto.js';

export class UpdateAttractionDto extends PartialType(CreateAttractionDto) {}
