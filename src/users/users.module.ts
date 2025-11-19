import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { UsersController } from './controllers/users.controller';

@Module({
  providers: [UsersService, PrismaService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
