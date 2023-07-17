import { Body, Controller, Patch, Post, UseGuards, Param, Delete } from "@nestjs/common";

import { AuthGuard } from "@nestjs/passport";

import { AdminService } from '../services/admin.service';
import { UserEntity } from "../../auth/entities/user.entity";
import { AddMgDto } from "../dto/add-mg.dto";
import { RolesGuard } from "../../auth/guards/role.guard";
import { Role } from "../../auth/decorators/role.decorator";
import { ROLES } from "../../common/types/roles.enum";
import { UpdateMgDto } from "../dto/update-mg.dto";
import { PhoneNumberDto } from "../dto/phonenumber.dto";

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Role(ROLES.ADMIN)
    @Post('addmg')
    addMg(@Body() addMgDto: AddMgDto): Promise<UserEntity> {
        return this.adminService.addMg(addMgDto)
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Role(ROLES.ADMIN)
    @Patch('updateMg/:phoneNumber')
    updateMg(
        @Param() phoneNumberDto: PhoneNumberDto,
        @Body() updateMgDto: UpdateMgDto
    ): Promise<UserEntity> {
        return this.adminService.updateMg(phoneNumberDto, updateMgDto);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Role(ROLES.ADMIN)
    @Delete('deleteMg/:phoneNumber')
    removeMg(
        @Param() phoneNumberDto: PhoneNumberDto,
    ): Promise<UserEntity> {
        return this.adminService.removeMg(phoneNumberDto);
    }

    
}