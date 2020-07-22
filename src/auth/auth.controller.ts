import { Controller, UseGuards, Post, Request, Body, Next } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { LoginUserResponse } from "src/apiTypes";



@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Request() req): Promise<LoginUserResponse> {
        return this.authService.login(req.user);
    }

    @Post('signup')
    async create(
        @Body('username') e: string,
        @Body('password') p: string,
        @Body('usertag') u: string,
    ): Promise<LoginUserResponse> {
        return this.authService.signup(e, p, u);
    }

}