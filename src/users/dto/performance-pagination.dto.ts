import { IsAlphanumeric, IsDateString, IsIn, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { districtName } from "src/district/dto/add-district.dto";

export class PerformancePaginationDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @Length(8, 8)
    @IsAlphanumeric()
    terminalID: string;

    @IsOptional()
    @IsDateString()
    @IsNotEmpty()
    date: string;
    
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @IsIn(districtName)
    district: string;
}