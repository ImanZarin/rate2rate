import { PassportStrategy } from "@nestjs/passport";
import { Strategy as jStrategy, ExtractJwt } from 'passport-jwt';

export class JwtStrategy extends PassportStrategy(jStrategy) {

    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET_KEY//Constants.jwtConstants.secret,
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, username: payload.username };
    }
}