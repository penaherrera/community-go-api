import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';
import { GoogleStrategy } from './auth/strategies/google.strategy';
import { ConfigModule } from '@nestjs/config';
import { AttendancesModule } from './attendances/attendances.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    EventsModule,
    LikesModule,
    CommentsModule,
    AttendancesModule,
    BookmarksModule,
  ],
  providers: [GoogleStrategy],
})
export class AppModule {}
