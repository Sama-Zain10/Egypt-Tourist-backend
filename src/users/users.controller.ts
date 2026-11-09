import { Body, Controller, Get, NotFoundException, Patch, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthUser, CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { User } from './schemas/user.schema.js';

@Controller('me')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(@InjectModel(User.name) private readonly users: Model<User>) {}

  @Get()
  async me(@CurrentUser() u: AuthUser) {
    const user = await this.users.findById(u.id);
    if (!user) throw new NotFoundException();
    return user;
  }

  @Patch()
  async update(@CurrentUser() u: AuthUser, @Body() dto: UpdateProfileDto) {
    const user = await this.users.findByIdAndUpdate(u.id, { $set: dto }, { new: true, runValidators: true });
    if (!user) throw new NotFoundException();
    return user;
  }
}
