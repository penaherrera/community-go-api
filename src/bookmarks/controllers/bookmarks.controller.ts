import { Controller, Get, Post, Param, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { User } from "../../users/decorators/get-user.decorator";
import { UserEntity } from "../../users/entities/user.entity";
import { BookmarksService } from "../services/bookmarks.service";

@Controller('events/:eventId/bookmarks')
@UseGuards(JwtAuthGuard)
export class BookmarksController {
    constructor(private readonly bookmarksService: BookmarksService) { }

    @Post('toggle')
    async toggle(@Param('eventId') eventId: string, @User() user: UserEntity) {
        return this.bookmarksService.toggle(eventId, user.id);
    }
}