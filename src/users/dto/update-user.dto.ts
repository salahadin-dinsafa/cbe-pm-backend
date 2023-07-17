import { IsOptional, IsPhoneNumber, Matches, MinLength } from "class-validator";

export class UpdateUserDto {

    @IsOptional()
    @MinLength(2)
    firstName: string;

    @IsOptional()
    @MinLength(2)
    lastName: string;

    @IsOptional()
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message:
            'Password must contain at least 1 character, 1 number , 1 alphabet  ',
    })
    @MinLength(8)
    password: string;

    @IsOptional()
    @IsPhoneNumber('ET')
    phoneNumber: string;
}