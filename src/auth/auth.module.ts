import { Module } from "@nestjs/common";
import { UserModule } from "src/users/users.module";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { Constants } from "src/app.constants";
import { JwtStrategy } from "./jwt.strategy";
import { AuthController } from "./auth.controller";
import { AnonymousStrategy } from "./anonymous.startegy";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('../config');
//console.log("mongo is: ",config.mongoUrl);
const secret = config.secret;

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: secret,//Constants.jwtConstants.secret,
            signOptions: { expiresIn: Constants.jwtConstants.expiringTime },
        })],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy, AnonymousStrategy],
    exports: [AuthService]
})

export class AuthModule { };