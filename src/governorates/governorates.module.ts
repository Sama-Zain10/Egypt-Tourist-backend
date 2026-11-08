import { Module } from '@nestjs/common';
import { GovernoratesService } from './governorates.service.js';
import { GovernoratesController } from './governorates.controller.js';

@Module({
  controllers: [GovernoratesController],
  providers: [GovernoratesService],
})
export class GovernoratesModule {}
