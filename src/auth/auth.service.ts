import { Injectable } from "@nestjs/common";
import { UserService } from "src/users/users.service";
import { JwtService } from '@nestjs/jwt';
import { IUser } from "src/users/user.model";


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
        const payload = { username: user._doc.email, sub: user._doc._id };
        const mUser: IUser = await this.userService.find(user._doc._id);
        return {
            // eslint-disable-next-line @typescript-eslint/camelcase
            accessToken: this.jwtService.sign(payload),
            user: JSON.stringify(mUser)
        };
    }

    async signup(e: string, p: string, u: string): Promise<IUser> {
        const id: IUser = await this.userService.create(e, p, u);
        return id;
    }

}