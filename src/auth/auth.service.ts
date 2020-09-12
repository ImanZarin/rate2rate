import { Injectable } from "@nestjs/common";
import { UserService } from "src/users/users.service";
import { JwtService } from '@nestjs/jwt';
import { IUser } from "src/users/user.model";
import { LoginUserResponse } from "src/shared/apiTypes";
import { LoginUserResponseResult } from "src/shared/result.enums";
import { compare } from "bcrypt";


@Injectable()
export class AuthService {

    constructor(
        private userService: UserService,
        private jwtService: JwtService) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userService.searchEmail(email);
        const allowed: boolean = await compare(pass, user.password);
        //if (user && (user.password === pass || user.password.length == 0)) {
        if (user && allowed) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any): Promise<LoginUserResponse> {
        return await this.getJwtToken(user._doc.email, user._doc._id);
    }

    private async getJwtToken(email: string, id: string): Promise<LoginUserResponse> {
        const payload = { username: email, sub: id };
        const mUser: IUser = (await this.userService.find([id]))[0];
        if (mUser)
            return {
                result: LoginUserResponseResult.success,
                // eslint-disable-next-line @typescript-eslint/camelcase
                accessToken: this.jwtService.sign(payload),
                user: {
                    id: mUser._id,
                    email: mUser.email,
                    username: mUser.username,
                    buddies: []
                }
            };
        else
            return {
                result: LoginUserResponseResult.userNotFound,
                accessToken: "",
                user: null
            };


    }

    async signup(e: string, p: string, u: string): Promise<LoginUserResponse> {
        const user: IUser = await this.userService.create(e, p, u);
        if (user)
            return await this.getJwtToken(user.email, user._id);
        else
            return {
                result: LoginUserResponseResult.repetedEmail,
                accessToken: "",
                user: null
            };
    }

}