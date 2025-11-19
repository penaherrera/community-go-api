import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateCommentDto } from '../dto/requests/create-comment.dto';
import { UpdateCommentDto } from '../dto/requests/update-comment.dto';
import { CommentDto } from '../dto/responses/comment.dto';
import { plainToInstance } from 'class-transformer';
import { CreatorDto } from '../../events/dto/responses/creator.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createCommentDto: CreateCommentDto,
    userId: string,
  ): Promise<CommentDto> {
    const comment = await this.prisma.comment.create({
      data: {
        ...createCommentDto,
        userId,
      },
      include: {
        user: true,
        event: true,
      },
    });

    const userDto = plainToInstance(CreatorDto, comment.user, {
      excludeExtraneousValues: true,
    });

    return plainToInstance(
      CommentDto,
      {
        ...comment,
        user: userDto,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
    userId: string,
  ): Promise<CommentDto> {
    const existingComment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!existingComment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    //Note: This validation can be added as a guard
    if (existingComment.userId !== userId) {
      throw new ForbiddenException('You can only update your own comments');
    }

    const updatedComment = await this.prisma.comment.update({
      where: { id },
      data: updateCommentDto,
      include: {
        user: true,
      },
    });

    const userDto = plainToInstance(CreatorDto, updatedComment.user, {
      excludeExtraneousValues: true,
    });

    return plainToInstance(
      CommentDto,
      {
        ...updatedComment,
        user: userDto,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async remove(id: string, userId: string): Promise<void> {
    const existingComment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!existingComment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    if (existingComment.userId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.prisma.comment.delete({
      where: { id },
    });
  }
}
