import {
    Body,
    Controller,
    Delete,
    Param,
    Patch,
    Post, Query, UseGuards
} from "@nestjs/common";

import { AuthGuard } from "@nestjs/passport";

import { MgService } from "../services/mg.service";
import { RolesGuard } from "../../auth/guards/role.guard";
import { Role } from "../../auth/decorators/role.decorator";
import { ROLES } from "../../common/types/roles.enum";
import { UserEntity } from "../../auth/entities/user.entity";
import { AddStaffDto } from "../dto/add-staff.dto";
import { User } from "../../auth/decorators/user.decorator";
import { PhoneNumberDto } from "../dto/phonenumber.dto";
import { UpdateStaffDto } from "../dto/update-staff.dto";
import { ToTerminalDto } from "../dto/to-terminal.dto";

@Controller('mg')
export class MgController {
    constructor(private readonly mgService: MgService) { }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Role(ROLES.DISTRICT_IS_MG, ROLES.IS)
    @Post('addStaff')
    addStaff(
        @Body() addStaffDto: AddStaffDto,
        @User() user: UserEntity
    ): Promise<UserEntity> {
        return this.mgService.addStaff(user, addStaffDto)
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Role(ROLES.DISTRICT_IS_MG, ROLES.IS)
    @Patch('updateStaff/:phoneNumber')
    updateStaff(
        @Param() phoneNumberDto: PhoneNumberDto,
        @Body() updateMgDto: UpdateStaffDto,
        @User() user: UserEntity,
    ): Promise<UserEntity> {
        return this.mgService.updateStaff(user, phoneNumberDto, updateMgDto);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Role(ROLES.DISTRICT_IS_MG, ROLES.IS)
    @Delete('deleteStaff/:phoneNumber')
    removeStaff(
        @Param() phoneNumberDto: PhoneNumberDto,
        @User() user: UserEntity,
    ): Promise<UserEntity> {
        return this.mgService.removeStaff(user, phoneNumberDto);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Role(ROLES.DISTRICT_IS_MG, ROLES.IS)
    @Post('toTerminal')
    addOperatorToTerminal(
        @Query() toTerminalDto: ToTerminalDto,
        @User() user: UserEntity
    ): Promise<UserEntity> {
        return this.mgService.addOperatorToTerminal(user, toTerminalDto);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Role(ROLES.DISTRICT_IS_MG, ROLES.IS)
    @Delete('toTerminal')
    removeOperatorFromTerminal(
        @Query() toTerminalDto: ToTerminalDto,
        @User() user: UserEntity
    ): Promise<UserEntity> {
        return this.mgService.removeOperatorFromTerminal(user, toTerminalDto);
    }


}