import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { UserEntity } from "../entities/user.entity";
import { ROLES } from "src/common/types/roles.enum";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<ROLES[]>(process.env.ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if (!requiredRoles) return true;
        const { user }: { user: UserEntity } = context.switchToHttp().getRequest();

        return requiredRoles.some(role => user.role?.includes(role));
    }
}