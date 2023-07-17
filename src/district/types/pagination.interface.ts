import { ROLES } from "../../common/types/roles.enum";

export interface IPagination {
    limit?: number;
    offset?: number;
    role?: ROLES,
    districtName?: string;
}