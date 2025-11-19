import { Expose } from 'class-transformer';

export class CreatorDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly firstName: string;

  @Expose()
  readonly lastName: string;

  @Expose()
  readonly userName: string;
}
