import { IsPhoneNumber } from "class-validator";

export class PhoneNumberDto {
    @IsPhoneNumber('ET', {message: 'Query phone number must be a valid phone number'})
    phoneNumber: string;
}