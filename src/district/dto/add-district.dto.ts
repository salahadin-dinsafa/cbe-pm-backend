import { IsIn, IsNotEmpty, IsString } from "class-validator";
export const districtName = [
    'DEBRE MARKOS',
    'DESSIE',
    'DIRE DAWA',
    'GONDAR',
    'JIJIGA',
    'WOLDIA',
    'BAHIRDAR',
    'DEBRE BERHAN',
]
export class AddDistrictDto {
    @IsString()
    @IsNotEmpty()
    @IsIn(districtName)
    name: string;
}