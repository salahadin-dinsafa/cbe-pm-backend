import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsString, Max, Min, MinLength, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { TerminalIDDto } from "./terminal-id.dto";
import { OmitType } from "@nestjs/mapped-types";

class Performance extends TerminalIDDto {
    @IsNumber()
    inService: number;

    @IsDateString()
    @IsNotEmpty()
    date: string;

    @IsString()
    @MinLength(5)
    name: string;
}

class Average extends OmitType(Performance, ['date', 'name']) { }

export class PerformanceDto {
    @IsDateString()
    @IsNotEmpty()
    date: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Performance)
    performances: Performance[];

    @IsNotEmpty()
    @IsArray()
    @ValidateNested()
    @Type(() => Average)
    average: Average[];
}