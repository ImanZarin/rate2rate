import { PassportStrategy } from "@nestjs/passport";
import { Strategy as jStrategy, ExtractJwt } from 'passport-jwt';
import { Constants } from "app.constants";
import { UnauthorizedException } from "@nestjs/common";

export class JwtStrategy extends PassportStrategy(jStrategy) {

    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: Constants.jwtConstants.secret,
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, username: payload.username };
    }
}