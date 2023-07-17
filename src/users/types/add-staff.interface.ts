import { ROLES } from "../../common/types/roles.enum";

export interface IAddStaff {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: ROLES
}