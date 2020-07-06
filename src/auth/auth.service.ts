import { Injectable } from "@nestjs/common";
import { UserService } from "src/users/users.service";
import {JwtService} from '@nestjs/jwt';


@Injectable()
export class AuthService {

    constructor(private userService: UserService, private jwtService: JwtService){}

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.userService.find(username);
        if (user && user.password === pass) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...result } = user;
          return result;
        }
        return null;
      }

      async login(user: any) {
          console.log("test auth service user: ", user);
        const payload = { username: user.username, sub: user.userId };
        console.log("test auth service payload: ", payload);
        return {
          // eslint-disable-next-line @typescript-eslint/camelcase
          access_token: this.jwtService.sign(payload),
        };
      }
      
}