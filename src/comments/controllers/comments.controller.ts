import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { CommentsService } from '../services/comments.service';
import { UpdateCommentDto } from '../dto/requests/update-comment.dto';
import { CreateCommentDto } from '../dto/requests/create-comment.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { User } from '../../users/decorators/get-user.decorator';
import { UserEntity } from '../../users/entities/user.entity';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @User() user: UserEntity) {
    return this.commentsService.create(createCommentDto, user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @User() user: UserEntity,
  ) {
    return this.commentsService.update(id, updateCommentDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: UserEntity) {
    return this.commentsService.remove(id, user.id);
  }
}
