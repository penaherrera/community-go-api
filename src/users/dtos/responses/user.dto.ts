import { Expose, Transform } from 'class-transformer';

export class UserDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly firstName: string;

  @Expose()
  readonly lastName: string;

  @Expose()
  readonly userName: string;

  @Expose()
  readonly email: string;

  @Expose()
  readonly profilePictureUrl: string | null;

  @Expose()
  @Transform(({ value }) => value.toISOString())
  readonly createdAt: Date;

  @Expose()
  @Transform(({ value }) => value.toISOString())
  readonly updatedAt: Date;
}
