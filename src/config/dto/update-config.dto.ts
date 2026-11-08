import { PartialType } from '@nestjs/mapped-types';
import { CreateConfigDto } from './create-config.dto.js';

export class UpdateConfigDto extends PartialType(CreateConfigDto) {}
