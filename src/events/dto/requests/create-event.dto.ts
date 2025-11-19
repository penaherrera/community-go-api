import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsString()
  readonly captions: string;

  @IsNotEmpty()
  @IsDateString()
  readonly startDate: Date;

  @IsOptional()
  @IsString()
  readonly address?: string;
}
