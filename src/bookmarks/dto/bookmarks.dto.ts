import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class BookmarkEventOwnerDto {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  userName: string;

  @Expose()
  profilePictureUrl: string | null;
}

@Exclude()
export class BookmarkEventDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  captions: string;

  @Expose()
  imageUrl: string | null;

  @Expose()
  startDate: Date;

  @Expose()
  address: string | null;

  @Expose()
  isActive: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  @Type(() => BookmarkEventOwnerDto)
  user: BookmarkEventOwnerDto;

  @Expose()
  likesCount?: number;

  @Expose()
  commentsCount?: number;

  @Expose()
  attendancesCount?: number;
}

@Exclude()
export class BookmarkDto {
  @Expose()
  id: string;

  @Expose()
  createdAt: Date;

  @Expose()
  @Type(() => BookmarkEventDto)
  event: BookmarkEventDto;
}