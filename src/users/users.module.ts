import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { PrismaService } from '../common/prisma/prisma.service';


@Module({
  providers: [
    UsersService,
    PrismaService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
