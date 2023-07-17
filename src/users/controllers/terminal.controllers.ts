import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";

import { AuthGuard } from "@nestjs/passport";

import { Role } from "../../auth/decorators/role.decorator";
import { User } from "../../auth/decorators/user.decorator";
import { UserEntity } from "../../auth/entities/user.entity";
import { RolesGuard } from "../../auth/guards/role.guard";
import { ROLES } from "../../common/types/roles.enum";
import { TerminalEntity } from "../../district/entities/terminal.entity";
import { TerminalService } from "../services/terminal.service";
import { AddTerminalDto } from "../dto/add-terminal.dto";
import { UpdateTerminalDto } from "../dto/update-terminal.dto";
import { TerminalIDDto } from "../dto/terminal-id.dto";
import { PaginationDto } from "../../district/dto/pagination.dto";

@Controller('terminal')
export class TerminalController {
    constructor(private readonly terminalService: TerminalService) { }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Role(ROLES.DISTRICT_IS_MG, ROLES.IS)
    @Post('addTerminal')
    addTerminal(
        @Body() addTerminalDto: AddTerminalDto,
        @User() user: UserEntity,
    ): Promise<TerminalEntity> {
        return this.terminalService.addTerminal(user, addTerminalDto);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Role(ROLES.DISTRICT_IS_MG, ROLES.IS)
    @Patch('update/:terminalID')
    updateTerminal(
        @Param() terminalIDDto: TerminalIDDto,
        @Body() updateTerminalDto: UpdateTerminalDto,
        @User() user: UserEntity,
    ): Promise<TerminalEntity> {
        return this.terminalService.updateTerminal(terminalIDDto, user, updateTerminalDto);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Role(ROLES.DISTRICT_IS_MG, ROLES.IS)
    @Delete('delete/:terminalID')
    removeTerminal(
        @Param() terminalIDDto: TerminalIDDto,
        @User() mgOrIS: UserEntity,
    ): Promise<TerminalEntity> {
        return this.terminalService.removeTerminal(terminalIDDto, mgOrIS);
    }

    @Get()
    findAllTerminal(@Body() paginationDto: PaginationDto): Promise<TerminalEntity[]> {
        return this.terminalService.findAllTerminals(paginationDto)
    }


}