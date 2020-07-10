import { Injectable } from "@nestjs/common";
import { UserService } from "src/users/users.service";
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

    constructor(
        private userService: UserService, 
        private jwtService: JwtService) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.userService.searchName(username);
        if (user && (user.password === pass || user.password.length == 0)) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user._doc.username, sub: user._doc.email };
        return {
            // eslint-disable-next-line @typescript-eslint/camelcase
            accessToken: this.jwtService.sign(payload),
            userName: user._doc.username
        };
    }

}