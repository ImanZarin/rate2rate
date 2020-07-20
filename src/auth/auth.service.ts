import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { UserService } from "src/users/users.service";
import { JwtService } from '@nestjs/jwt';
import { IUser } from "src/users/user.model";
import { LoginUserResponse } from "src/apiTypes";


@Injectable()
export class AuthService {

    constructor(
        private userService: UserService,
        private jwtService: JwtService) { }

    async validateUser(email: string, pass: string): Promise<any> {
        console.log("email is: ", email, " and password is: ", pass);
        const user = await this.userService.searchEmail(email);
        console.log("user is: ", user);
        if (user && (user.password === pass || user.password.length == 0)) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        return await this.getJwtToken(user._doc.email, user._doc._id);
    }

    private async getJwtToken(email: string, id: string): Promise<LoginUserResponse> {
        const payload = { username: email, sub: id };
        const mUser: IUser = await this.userService.find(id);
        return {
            // eslint-disable-next-line @typescript-eslint/camelcase
            accessToken: this.jwtService.sign(payload),
            user: mUser
        };
    }

    async signup(e: string, p: string, u: string): Promise<LoginUserResponse> {
        const user: IUser = await this.userService.create(e, p, u);
        if (user)
            return await this.getJwtToken(user.email, user._id);
        else
            throw new HttpException("this email has already been used, try another or login through the link", HttpStatus.FORBIDDEN);
    }

}