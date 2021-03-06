import { PassportStrategy } from "@nestjs/passport";
import { Strategy as jStrategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(jStrategy) {

    constructor(readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("JWT_SECRET_KEY")
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, username: payload.username };
    }
}