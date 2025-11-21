import { plainToInstance } from "class-transformer";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";
import { AttendanceDto } from "../dto/attedance.dto";

@Injectable()
export class AttendancesService {
    constructor(private readonly prisma: PrismaService) { }

    async findOne(attendanceId: string): Promise<AttendanceDto | null> {
        const attendance = await this.prisma.attendance.findUniqueOrThrow({
            where: {
                id: attendanceId,
            },
            include: {
                user: true,
                event: true,
            },
        });
        return plainToInstance(AttendanceDto, attendance, { excludeExtraneousValues: true });
    }

    async findAll(eventId: string): Promise<AttendanceDto[]> {
        const attendances = await this.prisma.attendance.findMany({
            where: {
                eventId,
            },
            include: {
                user: true,
                event: true,
            },
        });
        return plainToInstance(AttendanceDto, attendances, { excludeExtraneousValues: true });
    }

    async toggle(eventId: string, userId: string): Promise<{ message: string; data: AttendanceDto }> {
        const existingAttendance = await this.prisma.attendance.findUnique({
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

        if (existingAttendance) {
            await this.prisma.attendance.delete({
                where: {
                    id: existingAttendance.id,
                },
            });
            return {
                message: "Attendance deleted",
                data: plainToInstance(AttendanceDto, existingAttendance, { excludeExtraneousValues: true })
            };
        } else {
            const attendance = await this.prisma.attendance.create({
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
                message: "Attendance created",
                data: plainToInstance(AttendanceDto, attendance, { excludeExtraneousValues: true })
            }
        }
    }
}