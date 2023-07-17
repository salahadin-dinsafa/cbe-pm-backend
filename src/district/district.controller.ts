import {
    Body,
    Controller,
    ParseIntPipe,
    Patch,
    Post,
    Param,
    UseGuards,
    Get,
    Query,
    Delete
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { DistrictService } from './district.service';
import { DistrictEntity } from './entities/district.entity';
import { AddDistrictDto } from './dto/add-district.dto';
import { RolesGuard } from '../auth/guards/role.guard';
import { Role } from '../auth/decorators/role.decorator';
import { ROLES } from '../common/types/roles.enum';
import { PaginationDto } from './dto/pagination.dto';

@Controller('district')
export class DistrictController {
    constructor(private readonly districtService: DistrictService) { }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Role(ROLES.ADMIN)
    @Post('add')
    addDistrict(@Body() addDistrictDto: AddDistrictDto): Promise<DistrictEntity> {
        return this.districtService.addDistrict(addDistrictDto);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Role(ROLES.ADMIN)
    @Patch(':id')
    updateDistrict(
        @Param('id', ParseIntPipe) id: string,
        @Body() updateDistrictDto: AddDistrictDto): Promise<DistrictEntity> {
        return this.districtService.updateDistrict(id, updateDistrictDto)
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Role(ROLES.ADMIN)
    @Delete(':id')
    deleteDistrict(@Param('id', ParseIntPipe) id: string): Promise<DistrictEntity> {
        return this.districtService.deleteDistrict(id);
    }

    @Get()
    findAllDistrict(
        @Query() paginationDto: PaginationDto
    ): Promise<DistrictEntity[]> {
        return this.districtService.findAllDistrict(paginationDto)
    }

    @Get('id')
    findDistrict(@Param('id', ParseIntPipe) id: string): Promise<DistrictEntity> {
        return this.districtService.findDistrict(id)
    }
}
