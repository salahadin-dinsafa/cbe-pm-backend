import { Injectable, UnauthorizedException } from "@nestjs/common";

import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { IPayload } from "../interface/payload.interface";
import { AuthService } from "../auth.service";
import { UserEntity } from "../entities/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        })
    }

    async validate(payload: IPayload): Promise<UserEntity> {
        const user: UserEntity =
            await this.authService.findUserByPhone(payload.phoneNumber);
        if (!user) throw new UnauthorizedException();

        return user;
    }
}