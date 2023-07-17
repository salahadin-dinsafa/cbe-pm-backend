import { SetMetadata } from '@nestjs/common';

import { ROLES } from "../../common/types/roles.enum";

export const Role = (...roles: ROLES[]) => SetMetadata(process.env.ROLES_KEY, roles);