import { HttpModule, HttpService, Module } from "@nestjs/common";
import { UserModule } from "src/users/users.module";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { Constants } from "src/app.constants";
import { JwtStrategy } from "./jwt.strategy";
import { AuthController } from "./auth.controller";
import { AnonymousStrategy } from "./anonymous.startegy";
import { ConfigService, ConfigModule } from "@nestjs/config";


@Module({
    imports: [
        HttpModule,
        UserModule,
        PassportModule,
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>("JWT_SECRET_KEY"),
                signOptions: {
                    expiresIn: Constants.jwtConstants.expiringTime,
                },
            }),
            inject: [ConfigService]
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy, AnonymousStrategy],
    exports: [AuthService]
})

export class AuthModule { };