import { Expose } from 'class-transformer';
import { EventDetailDto } from 'src/events/dto/responses/event-detail.dto';

export class AttendanceDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly event: EventDetailDto;

  @Expose()
  readonly userId: string;

  @Expose()
  readonly createdAt: Date;
}