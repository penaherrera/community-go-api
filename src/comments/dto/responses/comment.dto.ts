import { Expose, Transform, Type } from 'class-transformer';
import { CreatorDto } from '../../../events/dto/responses/creator.dto';

export class CommentDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly content: string;

  @Expose()
  @Type(() => CreatorDto)
  readonly user: CreatorDto;

  @Expose()
  readonly createdAt: Date;

  @Expose()
  readonly updatedAt: Date;
}
