import { Module } from "@nestjs/common";
import { UserModule } from "src/users/users.module";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { Constants } from "app.constants";

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: Constants.jwtConstants.secret,
            signOptions: { expiresIn: Constants.jwtConstants.expiringTime },
        })],
    providers: [AuthService, LocalStrategy],
    exports: [AuthService]
})

export class AuthModule { };