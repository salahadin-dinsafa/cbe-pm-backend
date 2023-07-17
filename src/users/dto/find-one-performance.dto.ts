import { IsDateString, IsNotEmpty } from "class-validator";

import { TerminalIDDto } from "./terminal-id.dto";

export class FindOnePerformanceDto extends TerminalIDDto {
    @IsDateString()
    @IsNotEmpty()
    date: string;
}