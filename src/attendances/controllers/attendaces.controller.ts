import { Controller, Get, Post, Param, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { User } from "../../users/decorators/get-user.decorator";
import { UserEntity } from "../../users/entities/user.entity";
import { AttendancesService } from "../services/attendances.service";

@Controller('events/:eventId/attendances')
@UseGuards(JwtAuthGuard)
export class AttendancesController {
    constructor(private readonly attendancesService: AttendancesService) { }

    @Get(':attendanceId')
    async findOne(@Param('attendanceId') attendanceId: string) {
        return this.attendancesService.findOne(attendanceId);
    }

    @Get()
    async findAll(@Param('eventId') eventId: string) {
        return this.attendancesService.findAll(eventId);
    }

    @Post('toggle')
    async toggle(@Param('eventId') eventId: string, @User() user: UserEntity) {
        return this.attendancesService.toggle(eventId, user.id);
    }
}