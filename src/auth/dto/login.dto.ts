import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class LoginDto {
    @IsNotEmpty()
    @IsString()
    @IsPhoneNumber('ET')
    phoneNumber: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}