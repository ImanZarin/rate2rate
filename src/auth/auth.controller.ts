import { Controller, UseGuards, Post, Request, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";



@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Request() req) {
      return this.authService.login(req.user);
    }

    @Post('/signup')
    async create(
        @Body('username') u: string,
        @Body('email') e: string,
        @Body('password') p: string
    ) {
        return this.authService.signup(u, e, p);
    }
}