import { Exclude, Type } from 'class-transformer';
import { Event } from '@prisma/client';
import { UserEntity } from '../../users/entities/user.entity';
// import { LikeEntity } from '../../likes/entities/like.entity';
// import { BookMarkEntity } from '../../bookmarks/entities/bookmark.entity';

export class EventEntity implements Event {
  readonly id: string;

  readonly userId: string;

  readonly isActive: boolean;

  readonly title: string;

  readonly description: string;

  readonly imageUrl: string | null;

  readonly startDate: Date;

  readonly address: string | null;

  readonly createdAt: Date;

  readonly updatedAt: Date;

  readonly deletedAt: Date | null;

  @Type(() => UserEntity)
  readonly user: UserEntity;

  // @Type(() => LikeEntity)
  // readonly likes?: LikeEntity[];

  // @Type(() => BookMarkEntity)
  // readonly bookMarks?: BookMarkEntity[];
}
