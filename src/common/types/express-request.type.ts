import { Request } from "express";

import { UserEntity } from "../../auth/entities/user.entity";

export interface ExpressRequest extends Request {
    user?: UserEntity;
}