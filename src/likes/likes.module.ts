import { Module } from '@nestjs/common';
import { LikesService } from './services/likes.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { LikesController } from './controllers/likes.controller';

@Module({
  controllers: [LikesController],
  providers: [LikesService, PrismaService],
})
export class LikesModule {}
