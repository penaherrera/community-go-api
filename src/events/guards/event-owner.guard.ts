import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class EventOwnerGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const eventId = request.params.id;

    if (!user || !eventId) {
      throw new ForbiddenException('Access denied');
    }

    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { userId: true },
    });

    if (!event) {
      throw new ForbiddenException('Event not found');
    }

    if (event.userId !== user.id) {
      throw new ForbiddenException('You are not the owner of this event');
    }

    return true;
  }
}
