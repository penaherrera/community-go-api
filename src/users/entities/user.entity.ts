import { Exclude, Type } from 'class-transformer';
import { User } from '@prisma/client';
import { EventEntity } from 'src/events/entities/event.entity';

export class UserEntity implements User {
  readonly id: string;

  readonly firstName: string;

  readonly lastName: string;

  readonly userName: string;

  readonly email: string;

  readonly profilePictureUrl: string | null;

  @Exclude()
  readonly password: string;

  @Exclude()
  readonly resetPasswordToken: string | null;

  readonly createdAt: Date;

  readonly updatedAt: Date;

  readonly deletedAt: Date | null;

  //Following properties are going to be added:
  // @Type(() => AuthEntity)
  // readonly auth?: AuthEntity[];

  // @Type(() => RoleEntity)

  // @Type(() => LikeEntity)
  // readonly likes?: LikeEntity[];

  // @Type(() => BookMarkEntity)
  // readonly bookMarks?: BookMarkEntity[];

  @Type(() => EventEntity)
  readonly events?: EventEntity[];
}
