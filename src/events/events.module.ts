import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './controllers/events.controller';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Module({
  controllers: [EventsController],
  providers: [EventsService, PrismaService],
})
export class EventsModule {}
