import { Injectable } from '@nestjs/common';
import { CreateTransportDto } from './dto/create-transport.dto.js';
import { UpdateTransportDto } from './dto/update-transport.dto.js';

@Injectable()
export class TransportService {
  create(createTransportDto: CreateTransportDto) {
    return 'This action adds a new transport';
  }

  findAll() {
    return `This action returns all transport`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transport`;
  }

  update(id: number, updateTransportDto: UpdateTransportDto) {
    return `This action updates a #${id} transport`;
  }

  remove(id: number) {
    return `This action removes a #${id} transport`;
  }
}
