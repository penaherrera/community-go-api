import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateEventDto } from '../dto/requests/create-event.dto';
import { UpdateEventDto } from '../dto/requests/update-event.dto';
import { EventDto } from '../dto/responses/event.dto';
import { plainToInstance } from 'class-transformer';
import { UserDto } from '../../users/dtos/responses/user.dto';
import { CreatorDto } from '../dto/responses/creator.dto';

@Injectable()
export class EventsService {
  protected readonly logger = new Logger(EventsService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createEventDto: CreateEventDto,
    userId: string,
  ): Promise<EventDto> {
    const event = await this.prismaService.event.create({
      data: {
        ...createEventDto,
        userId,
      },
      include: {
        user: true,
        likes: true,
        bookMarks: true,
      },
    });

    return plainToInstance(
      EventDto,
      {
        ...event,
        user: plainToInstance(UserDto, event.user, {
          excludeExtraneousValues: true,
        }),
        likesCount: event.likes.length,
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

  async findAll(userId: string): Promise<EventDto[]> {
    const allEvents = await this.prismaService.event.findMany({
      where: {
        deletedAt: null,
        isActive: true,
      },
      include: {
        likes: true,
        bookMarks: true,
        user: true,
      },
    });

    return allEvents.map((event) => {
      const likesCount = event.likes.length;
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
        EventDto,
        {
          ...event,
          creator: creatorDto,
          likesCount,
          isLikedByCurrentUser,
          isBookmarkedByCurrentUser,
        },
        {
          excludeExtraneousValues: true,
        },
      );
    });
  }

  async findOne(id: string, userId: string): Promise<EventDto> {
    const event = await this.prismaService.event.findUnique({
      where: { id },
      include: {
        user: true,
        likes: true,
        bookMarks: true,
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    const likesCount = event.likes.length;
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
      EventDto,
      {
        ...event,
        creator: creatorDto,
        likesCount,
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
  ): Promise<EventDto> {
    const event = await this.prismaService.event.update({
      where: { id },
      data: updateEventDto,
      include: {
        user: true,
        likes: true,
        bookMarks: true,
      },
    });

    const likesCount = event.likes.length;
    const isLikedByCurrentUser = event.likes.some(
      (like) => like.userId === userId,
    );
    const isBookmarkedByCurrentUser = event.bookMarks.some(
      (bookmark) => bookmark.userId === userId,
    );

    return plainToInstance(EventDto, {
      ...event,
      likesCount,
      isLikedByCurrentUser,
      isBookmarkedByCurrentUser,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prismaService.event.delete({
      where: { id },
    });
  }
}
