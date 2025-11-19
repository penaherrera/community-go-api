import { Expose, Type } from 'class-transformer';
import { UserDto } from '../../../users/dtos/responses/user.dto';
import { CreatorDto } from './creator.dto';

export class EventDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly title: string;

  @Expose()
  readonly description: string;

  @Expose()
  readonly imageUrl: string | null;

  @Expose()
  readonly startDate: Date;

  @Expose()
  readonly address: string | null;

  @Expose()
  readonly isActive: boolean;

  @Expose()
  readonly createdAt: Date;

  @Expose()
  readonly updatedAt?: Date;

  @Expose()
  readonly likesCount?: number;

  @Expose()
  readonly isLikedByCurrentUser?: boolean;

  @Expose()
  readonly isBookmarkedByCurrentUser?: boolean;

  @Expose()
  @Type(() => CreatorDto)
  readonly creator: CreatorDto;
}
