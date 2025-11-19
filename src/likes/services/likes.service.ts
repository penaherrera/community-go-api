import { Injectable } from '@nestjs/common';
import { LikeDto } from '../dto/like.dto';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class LikesService {
  constructor(private readonly prisma: PrismaService) {}

  async toggle(eventId: string, userId: string): Promise<LikeDto | null> {
    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
      include: {
        user: true,
        event: true,
      },
    });

    if (existingLike) {
      await this.prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      return null;
    } else {
      const like = await this.prisma.like.create({
        data: {
          eventId,
          userId,
        },
        include: {
          user: true,
          event: true,
        },
      });

      return plainToInstance(LikeDto, like, { excludeExtraneousValues: true });
    }
  }
}
