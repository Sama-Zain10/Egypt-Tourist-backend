import { Module } from '@nestjs/common';
import { TransportService } from './transport.service.js';
import { TransportController } from './transport.controller.js';

@Module({
  controllers: [TransportController],
  providers: [TransportService],
})
export class TransportModule {}
