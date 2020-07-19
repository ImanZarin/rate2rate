import { Controller, UseGuards, Post, Request, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { IUser } from "src/users/user.model";



@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Request() req) {
      return this.authService.login(req.user);
    }

    @Post('signup')
    async create(
        @Body('email') e: string,
        @Body('password') p: string,
        @Body('username') u: string
    ): Promise<IUser> {
        return this.authService.signup(e, p, u);
    }

}