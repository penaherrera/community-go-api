import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { BookmarkDto } from "../dto/bookmarks.dto";
import { plainToInstance } from "class-transformer";

@Injectable()
export class BookmarksService {
    constructor(private readonly prisma: PrismaService) { }
    async toggle(eventId: string, userId: string): Promise<{ message: string; data: BookmarkDto }> {
        const existingBookmark = await this.prisma.bookMark.findUnique({
            where: {
                userId_eventId: {
                    userId,
                    eventId,
                },
            },
            include: {
                user: true,
                event: true,
            },
        });
        if (existingBookmark) {
            await this.prisma.bookMark.delete({
                where: {
                    id: existingBookmark.id,
                },
            });
            return {
                message: "Bookmark deleted",
                data: plainToInstance(BookmarkDto, existingBookmark, { excludeExtraneousValues: true })
            };
        } else {
            const bookmark = await this.prisma.bookMark.create({
                data: {
                    eventId,
                    userId,
                },
                include: {
                    user: true,
                    event: true,
                },
            });
            return {
                message: "Bookmark created",
                data: plainToInstance(BookmarkDto, bookmark, { excludeExtraneousValues: true })
            };
        }
    }
}