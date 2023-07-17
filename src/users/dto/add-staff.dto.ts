import { IsIn, IsNotEmpty } from "class-validator";
import { OmitType } from "@nestjs/mapped-types";


import { AddMgDto } from "./add-mg.dto";
import { ROLES } from "../../common/types/roles.enum";

export class AddStaffDto extends OmitType(AddMgDto, ['districtName']) {
    @IsNotEmpty()
    @IsIn([ROLES.IS, ROLES.OPERATOR])
    role: ROLES
}