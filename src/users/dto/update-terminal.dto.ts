import { PartialType } from "@nestjs/mapped-types";

import { AddTerminalDto } from "./add-terminal.dto";

export class UpdateTerminalDto extends PartialType(AddTerminalDto) {

}