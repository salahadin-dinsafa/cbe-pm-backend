import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";

import { AuthGuard } from "@nestjs/passport";

import { PerformanceService } from '../services/performance.service';
import { PerformanceEntity } from "../entities/performance.entity";
import { FindOnePerformanceDto } from "../dto/find-one-performance.dto";
import { TerminalIDDto } from "../dto/terminal-id.dto";
import { DateDto } from "../dto/date.dto";
import { Role } from "../../auth/decorators/role.decorator";
import { User } from "../../auth/decorators/user.decorator";
import { UserEntity } from "../../auth/entities/user.entity";
import { RolesGuard } from "../../auth/guards/role.guard";
import { ROLES } from "../../common/types/roles.enum";
import { PerformanceDto } from "../dto/performnace.dto";
import { PerformancePaginationDto } from "../dto/performance-pagination.dto";

@Controller('performance')
export class PerformanceController {
    constructor(private readonly performanceService: PerformanceService) { }

    @Get()
    findMany(@Query() performancePaginationDto: PerformancePaginationDto): Promise<PerformanceEntity[]> {
        return this.performanceService.findMany(performancePaginationDto);
    }

    @Get(':terminalID')
    findById(@Param() terminalIDDto: TerminalIDDto): Promise<PerformanceEntity[]> {
        return this.performanceService.findById(terminalIDDto);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Role(ROLES.DISTRICT_IS_MG, ROLES.IS)
    @Post()
    addPerformance(
        @Body() performanceDto: PerformanceDto,
        @User() user: UserEntity
    ) {
        return this.performanceService.addPerformance(user, performanceDto);
    }
}