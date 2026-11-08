import { PartialType } from '@nestjs/mapped-types';
import { CreateMapDto } from './create-map.dto.js';

export class UpdateMapDto extends PartialType(CreateMapDto) {}
