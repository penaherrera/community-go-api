import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';
import { AttendancesModule } from './attendances/attendances.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, EventsModule, LikesModule, CommentsModule, AttendancesModule, BookmarksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
