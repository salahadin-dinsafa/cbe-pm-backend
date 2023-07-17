import {
    IsNotEmpty, IsString,
    Length, IsAlphanumeric
} from "class-validator";

export class TerminalIDDto {

    @IsNotEmpty()
    @IsString()
    @Length(8, 8)
    @IsAlphanumeric()
    terminalID: string;
}