import { Expose, Type } from 'class-transformer';
import { CreatorDto } from './creator.dto';

export class EventSummaryDto {
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
  readonly isActive: boolean;

  @Expose()
  readonly createdAt: Date;

  @Expose()
  readonly commentsCount?: number;

  @Expose()
  readonly likesCount?: number;

  @Expose()
  readonly attendeesCount?: number;

  @Expose()
  readonly isLikedByCurrentUser?: boolean;

  @Expose()
  readonly isBookmarkedByCurrentUser?: boolean;

  @Expose()
  @Type(() => CreatorDto)
  readonly creator: CreatorDto;
}
