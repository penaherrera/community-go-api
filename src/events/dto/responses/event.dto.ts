import { Expose, Transform, Type } from 'class-transformer';
import { UserDto } from 'src/users/dtos/responses/user.dto';

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
  @Type(() => UserDto)
  readonly user: UserDto;

  @Expose()
  readonly likesCount?: number;

  @Expose()
  readonly isLikedByCurrentUser?: boolean;

  @Expose()
  readonly isBookmarkedByCurrentUser?: boolean;
}
