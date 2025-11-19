import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { EventsService } from '../events.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { EventOwnerGuard } from '../guards/event-owner.guard';
import { User } from '../../users/decorators/get-user.decorator';
import { UserEntity } from '../../users/entities/user.entity';
import { CreateEventDto } from '../dto/requests/create-event.dto';
import { UpdateEventDto } from '../dto/requests/update-event.dto';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto, @User() user: UserEntity) {
    return this.eventsService.create(createEventDto, user.id);
  }

  @Get()
  findAll(@User() user: UserEntity) {
    return this.eventsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User() user: UserEntity) {
    return this.eventsService.findOne(id, user.id);
  }

  @Put(':id')
  @UseGuards(EventOwnerGuard)
  update(
    @Param('id') id: string, 
    @Body() updateEventDto: UpdateEventDto,
    @User() user: UserEntity
  ) {
    return this.eventsService.update(id, updateEventDto, user.id);
  }

  @Delete(':id')
  @UseGuards(EventOwnerGuard)
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}