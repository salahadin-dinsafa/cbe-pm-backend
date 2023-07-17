import { PartialType } from "@nestjs/mapped-types";

import { AddStaffDto } from "./add-staff.dto";

export class UpdateStaffDto extends PartialType(AddStaffDto) { }