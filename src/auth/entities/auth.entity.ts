import { Exclude, Type } from 'class-transformer';
import { Auth } from '@prisma/client';
import { UserEntity } from '../../users/entities/user.entity';

export class AuthEntity implements Auth {
  readonly id: string;

  @Exclude()
  readonly jti: string;

  readonly userId: string;

  @Exclude()
  readonly refreshToken: string;

  readonly refreshExpiresAt: Date;

  readonly createdAt: Date;

  @Type(() => UserEntity)
  readonly user: UserEntity;
}