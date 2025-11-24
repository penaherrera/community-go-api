import { BookmarksService } from "./services/bookmarks.service";
import { Module } from "@nestjs/common";
import { BookmarksController } from "./controllers/bookmarks.controller";
import { PrismaService } from "../common/prisma/prisma.service";

@Module({
    controllers: [BookmarksController], 
    providers: [BookmarksService, PrismaService],
    exports: [BookmarksService],
})
export class BookmarksModule {}