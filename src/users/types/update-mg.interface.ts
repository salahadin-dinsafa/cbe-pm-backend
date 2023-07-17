import { ROLES } from "../../common/types/roles.enum";

export interface IUpdateMg {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    districtName?: string;
    role?: ROLES
}