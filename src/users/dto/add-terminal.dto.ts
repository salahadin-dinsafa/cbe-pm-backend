import {
    IsString, MinLength
} from "class-validator";
import { TerminalIDDto } from "./terminal-id.dto";

export class AddTerminalDto extends TerminalIDDto {

    @IsString()
    @MinLength(5)
    name: string;
}