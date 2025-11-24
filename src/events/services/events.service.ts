import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateEventDto } from '../dto/requests/create-event.dto';
import { UpdateEventDto } from '../dto/requests/update-event.dto';
import { EventSummaryDto } from '../dto/responses/event-summary.dto';
import { plainToInstance } from 'class-transformer';
import { UserDto } from '../../users/dtos/responses/user.dto';
import { CreatorDto } from '../dto/responses/creator.dto';
import { CommentDto } from '../../comments/dto/responses/comment.dto';
import { EventDetailDto } from '../dto/responses/event-detail.dto';

@Injectable()
export class EventsService {
  protected readonly logger = new Logger(EventsService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createEventDto: CreateEventDto,
    userId: string,
  ): Promise<EventSummaryDto> {
    const event = await this.prismaService.event.create({
      data: {
        ...createEventDto,
        userId,
      },
      include: {
        user: true,
        likes: true,
        bookMarks: true,
        attendances: true,
      },
    });

    return plainToInstance(
      EventSummaryDto,
      {
        ...event,
        user: plainToInstance(UserDto, event.user, {
          excludeExtraneousValues: true,
        }),
        likesCount: event.likes.length,
        attendeesCount: event.attendances.length,
        isLikedByCurrentUser: event.likes.some(
          (like) => like.userId === userId,
        ),
        isBookmarkedByCurrentUser: event.bookMarks.some(
          (bookmark) => bookmark.userId === userId,
        ),
      },
      { excludeExtraneousValues: true },
    );
  }

  async findAll(userId: string): Promise<EventSummaryDto[]> {
    const allEvents = await this.prismaService.event.findMany({
      where: {
        deletedAt: null,
        isActive: true,
      },
      include: {
        likes: true,
        bookMarks: true,
        comments: true,
        user: true,
        attendances: true,
      },
    });

    return allEvents.map((event) => {
      const likesCount = event.likes.length;
      const commentsCount = event.comments.length;
      const attendeesCount = event.attendances.length;

      const isLikedByCurrentUser = event.likes.some(
        (like) => like.userId === userId,
      );
      const isBookmarkedByCurrentUser = event.bookMarks.some(
        (bookmark) => bookmark.userId === userId,
      );

      const creatorDto = plainToInstance(CreatorDto, event.user, {
        excludeExtraneousValues: true,
      });

      return plainToInstance(
        EventSummaryDto,
        {
          ...event,
          creator: creatorDto,
          likesCount,
          attendeesCount,
          commentsCount,
          isLikedByCurrentUser,
          isBookmarkedByCurrentUser,
        },
        {
          excludeExtraneousValues: true,
        },
      );
    });
  }

  async findOne(id: string, userId: string): Promise<EventDetailDto> {
    const event = await this.prismaService.event.findUnique({
      where: { id },
      include: {
        user: true,
        comments: {
          include: {
            user: true,
          },
        },
        likes: true,
        bookMarks: true,
        attendances: true,
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    const commentsCount = event.comments.length;
    const likesCount = event.likes.length;
    const attendeesCount = event.attendances.length;

    const isLikedByCurrentUser = event.likes.some(
      (like) => like.userId === userId,
    );

    const isBookmarkedByCurrentUser = event.bookMarks.some(
      (bookmark) => bookmark.userId === userId,
    );

    const creatorDto = plainToInstance(CreatorDto, event.user, {
      excludeExtraneousValues: true,
    });

    const commentsDto = event.comments.map((comment) => {
      const commentUserDto = plainToInstance(CreatorDto, comment.user, {
        excludeExtraneousValues: true,
      });

      return plainToInstance(
        CommentDto,
        {
          ...comment,
          user: commentUserDto,
        },
        {
          excludeExtraneousValues: true,
        },
      );
    });

    return plainToInstance(
      EventDetailDto,
      {
        ...event,
        creator: creatorDto,
        comments: commentsDto,
        likesCount,
        commentsCount,
        attendeesCount,
        isLikedByCurrentUser,
        isBookmarkedByCurrentUser,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async update(
    id: string,
    updateEventDto: UpdateEventDto,
    userId: string,
  ): Promise<EventDetailDto> {
    const event = await this.prismaService.event.update({
      where: { id },
      data: updateEventDto,
      include: {
        user: true,
        comments: {
          include: {
            user: true,
          },
        },
        likes: true,
        bookMarks: true,
        attendances: true,
      },
    });

    const commentsCount = event.comments.length;
    const likesCount = event.likes.length;
    const attendeesCount = event.attendances.length;

    const isLikedByCurrentUser = event.likes.some(
      (like) => like.userId === userId,
    );

    const isBookmarkedByCurrentUser = event.bookMarks.some(
      (bookmark) => bookmark.userId === userId,
    );

    const creatorDto = plainToInstance(CreatorDto, event.user, {
      excludeExtraneousValues: true,
    });

    const commentsDto = event.comments.map((comment) => {
      const commentUserDto = plainToInstance(CreatorDto, comment.user, {
        excludeExtraneousValues: true,
      });

      return plainToInstance(
        CommentDto,
        {
          ...comment,
          user: commentUserDto,
        },
        {
          excludeExtraneousValues: true,
        },
      );
    });

    return plainToInstance(
      EventDetailDto,
      {
        ...event,
        creator: creatorDto,
        comments: commentsDto,
        likesCount,
        commentsCount,
        attendeesCount,
        isLikedByCurrentUser,
        isBookmarkedByCurrentUser,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async remove(id: string): Promise<void> {
    await this.prismaService.event.delete({
      where: { id },
    });
  }
}
