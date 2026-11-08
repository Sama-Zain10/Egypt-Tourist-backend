import { Injectable } from '@nestjs/common';
import { CreateGovernorateDto } from './dto/create-governorate.dto.js';
import { UpdateGovernorateDto } from './dto/update-governorate.dto.js';

@Injectable()
export class GovernoratesService {
  create(createGovernorateDto: CreateGovernorateDto) {
    return 'This action adds a new governorate';
  }

  findAll() {
    return `This action returns all governorates`;
  }

  findOne(id: number) {
    return `This action returns a #${id} governorate`;
  }

  update(id: number, updateGovernorateDto: UpdateGovernorateDto) {
    return `This action updates a #${id} governorate`;
  }

  remove(id: number) {
    return `This action removes a #${id} governorate`;
  }
}
