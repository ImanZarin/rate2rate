import { Injectable } from "@nestjs/common";
import { UserService } from "src/users/users.service";
import { JwtService } from '@nestjs/jwt';
import { IUser } from "src/users/user.model";


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
        const mUser: IUser = await this.userService.searchName(user._doc.username);
        return {
            // eslint-disable-next-line @typescript-eslint/camelcase
            accessToken: this.jwtService.sign(payload),
            user: JSON.stringify(mUser)
        };
    }

    async signup(u: string, e: string, p: string){
        const id: string = await this.userService.create(u, e, p);
        return id;
    }

}