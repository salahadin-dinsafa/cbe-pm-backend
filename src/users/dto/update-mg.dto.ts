import { PartialType } from "@nestjs/mapped-types";

import { AddMgDto } from "./add-mg.dto";

export class UpdateMgDto extends PartialType(AddMgDto) {

}