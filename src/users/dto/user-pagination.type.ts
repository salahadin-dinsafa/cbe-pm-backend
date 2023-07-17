import { PickType } from "@nestjs/mapped-types";
import { IsEnum, IsOptional } from "class-validator";

import { ROLES } from "../../common/types/roles.enum";
import { PaginationDto } from "../../district/dto/pagination.dto";

export class UserPagination extends PickType(PaginationDto, ['limit', 'offset']) {
    @IsEnum(ROLES)
    @IsOptional()
    role: ROLES;

    @IsOptional()
    districtName: string;
}