import { Expose } from 'class-transformer';

export class LikeDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly eventId: string;

  @Expose()
  readonly userId: string;

  @Expose()
  readonly createdAt: Date;
}
