import { IsNotEmpty, IsString, Length, IsAlphanumeric } from "class-validator";

import { PhoneNumberDto } from "./phonenumber.dto";

export class ToTerminalDto extends PhoneNumberDto {
    @IsNotEmpty()
    @IsString()
    @Length(8, 8)
    @IsAlphanumeric()
    terminalID: string;
}