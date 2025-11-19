import { Expose, Type } from 'class-transformer';
import { CommentDto } from 'src/comments/dto/responses/comment.dto';
import { EventSummaryDto } from './event-summary.dto';

export class EventDetailDto extends EventSummaryDto {
  @Expose()
  readonly address: string | null;

  @Expose()
  readonly captions?: string;

  @Expose()
  readonly updatedAt?: Date;

  @Expose()
  @Type(() => CommentDto)
  readonly comments?: CommentDto[];
}
