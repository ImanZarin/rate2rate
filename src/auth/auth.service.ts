import { HttpService, Injectable } from "@nestjs/common";
import { UserService } from "src/users/users.service";
import { JwtService } from '@nestjs/jwt';
import { IUser } from "src/users/user.model";
import { LoginUserResponse } from "src/shared/apiTypes";
import { LoginUserResponseResult } from "src/shared/result.enums";
import { compare } from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import { response } from "express";


@Injectable()
export class AuthService {

    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private httpService: HttpService) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userService.searchEmail(email);
        if (!user)
            return null;
        const allowed: boolean = await compare(pass, user.password);
        //if (user && (user.password === pass || user.password.length == 0)) {
        if (allowed) {
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
        const payload = { username: email.toLowerCase(), sub: id };
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

    async signup(e: string, p: string, u: string, fb: string, g: string): Promise<LoginUserResponse> {
        const user: IUser = await this.userService.create(e, p, u, fb, g);
        if (user)
            return await this.getJwtToken(user.email, user._id);
        else
            return {
                result: LoginUserResponseResult.fail,
                accessToken: "",
                user: null
            };
    }

    async loginOrSignupFB(profile: any, token: string): Promise<LoginUserResponse> {
        const verified = await this.httpService.get("https://graph.facebook.com/debug_token?input_token=" + token + "&access_token=" + process.env.FACEBOOK_APP_ID + "|" + process.env.FACEBOOK_APP_SECRET).toPromise();
        if (verified.status == 200) {
            const user = await this.userService.searchFB(profile.id);
            if (user)
                return this.login(user);
            else
                return this.signup(profile.email.toLowerCase(), "", profile.name, profile.id, "");
        }
        else
            return {
                result: LoginUserResponseResult.fail,
                accessToken: "",
                user: null
            }
    }

    async loginOrSignupGoogle(profile: any, token: string): Promise<LoginUserResponse> {
        const verified = await this.verify(token).catch(console.error);
        if (verified) {
            const user = await this.userService.searchGoogle(profile.googleId);
            const oldUser = await this.userService.searchEmail(profile.email);
            if (user)
                return await this.login(user);
            else if (oldUser) {
                const updatedUser = await this.userService.update(user, null, profile.name, null, profile.googleId);
                return this.getJwtToken(profile.email, updatedUser._id);
            }
            else {
                const newUser = await this.signup(profile.email, "", profile.name, "", profile.googleId);
                return newUser;
            }

        }
        else
            return {
                result: LoginUserResponseResult.fail,
                accessToken: "",
                user: null
            }
    }

    async verify(token: string): Promise<boolean> {
        const client = new OAuth2Client(process.env.GOOGLE_APP_ID);
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_APP_ID,
        });
        if (ticket)
            return true;
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        return false;
    }

}