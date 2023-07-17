import { IsIn, IsNotEmpty, IsPhoneNumber, IsString, MinLength } from "class-validator";
import { districtName } from "../../district/dto/add-district.dto";

export class AddMgDto {

    @IsString()
    @MinLength(3)
    firstName: string;

    @IsString()
    @MinLength(3)
    lastName: string;

    @IsPhoneNumber('ET')
    phoneNumber: string;

    @IsString()
    @IsNotEmpty()
    @IsIn(districtName)
    districtName: string;
}