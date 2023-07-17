import { IsDateString, IsNotEmpty } from "class-validator";

export class DateDto {
    @IsDateString()
    @IsNotEmpty()
    date: string;
}