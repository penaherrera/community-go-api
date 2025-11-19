import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UpdateUserDto } from '../dtos/requests/update-user.dto';
import { UserDto } from '../dtos/responses/user.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserEntity } from '../entities/user.entity';
import { User } from '../decorators/get-user.decorator';
import { plainToInstance } from 'class-transformer';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  getProfile(@User() user: UserEntity) {
    return plainToInstance(UserEntity, user);
  }

  @Put('profile')
  async updateProfile(
    @User() user: UserEntity,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    return this.usersService.update(user.id, updateUserDto);
  }
}
