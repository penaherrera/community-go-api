import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class BookmarkOwnerGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const bookmarkId = request.params.id;

    if (!user || !bookmarkId) {
      throw new ForbiddenException('Access denied');
    }

    const bookmark = await this.prisma.bookMark.findUnique({
      where: { id: bookmarkId },
      select: { userId: true },
    });

    if (!bookmark) {
      throw new ForbiddenException('Bookmark not found');
    }

    if (bookmark.userId !== user.id) {
      throw new ForbiddenException('You are not the owner of this bookmark');
    }

    return true;
  }
}
