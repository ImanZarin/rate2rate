import { Controller, UseGuards, Post, Body, Get, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { LoginUserResponse } from "src/shared/apiTypes";
import { Request } from "express";



@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Req() req: Request): Promise<LoginUserResponse> {
        return this.authService.login(req.user);
    }

    @Post('signup')
    async create(
        @Body('username') e: string,
        @Body('password') p: string,
        @Body('usertag') u: string,
    ): Promise<LoginUserResponse> {
        return this.authService.signup(e.toLowerCase(), p, u, "", "");
    }

    @Post('/facebook')
    async facebookAuth(
        @Body("profile") profile: any,
        @Body("token") token: string
    ): Promise<LoginUserResponse> {
        return this.authService.loginOrSignupFB(profile, token);
    }

    @Post('/google')
    async googleAuth(
        @Body("profile") profile: any,
        @Body("token") token: string
    ) {
        return this.authService.loginOrSignupGoogle(profile, token);
    }

}