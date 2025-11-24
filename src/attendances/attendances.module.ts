import { AttendancesController } from "./controllers/attendaces.controller";
import { AttendancesService } from "./services/attendances.service";
import { PrismaService } from "../common/prisma/prisma.service";
import { Module } from "@nestjs/common";
import { EventsModule } from "src/events/events.module";

@Module({
    imports: [EventsModule],
    controllers: [AttendancesController],
    providers: [AttendancesService, PrismaService],
})
export class AttendancesModule {}       