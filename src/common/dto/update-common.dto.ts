import { PartialType } from '@nestjs/mapped-types';
import { CreateCommonDto } from './create-common.dto.js';

export class UpdateCommonDto extends PartialType(CreateCommonDto) {}
