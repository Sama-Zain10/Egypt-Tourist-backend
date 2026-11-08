import { PartialType } from '@nestjs/mapped-types';
import { CreateGovernorateDto } from './create-governorate.dto.js';

export class UpdateGovernorateDto extends PartialType(CreateGovernorateDto) {}
