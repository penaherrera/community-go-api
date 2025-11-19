import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { User } from '../../users/decorators/get-user.decorator';
import { UserEntity } from '../../users/entities/user.entity';
import { LikesService } from '../services/likes.service';

@Controller('events/:eventId/likes')
@UseGuards(JwtAuthGuard)
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('toggle')
  async toggle(@Param('eventId') eventId: string, @User() user: UserEntity) {
    return this.likesService.toggle(eventId, user.id);
  }
}
