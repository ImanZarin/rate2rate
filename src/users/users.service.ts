import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUser, IBody } from './user.model';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import passport = require('passport');
import { authenticate } from 'passport';
import { throwError } from 'rxjs';

@Injectable()
export class UserService {

    constructor(@InjectModel('User') private readonly userModel: Model<IUser>)
    //private readonly authService: AuthService) 
    { }

    async getAll(): Promise<IUser[]> {
        const result = await this.userModel.find().exec();
        return result;
    }

    async create(username: string, email: string, pass: string): Promise<string> {
        let sameUserId = await this.searchName(username);
        if (!sameUserId)
            sameUserId = await this.searchEmail(email);
        if (!sameUserId) {
            const newUser = new this.userModel({
                username: username,
                email: email,
                admin: false,
                bodies: [],
                password: pass
            });
            const savedUser: IUser = await newUser.save();
            passport.authenticate('local');
            // const user = {
            //     username: savedUser.username,
            //     userId: savedUser._id
            // };
            //const result = await this.authService.login(user);
            //return result.access_token;
            return savedUser.username;
        }
        else //user exist
            return null;
    }

    async find(id: string): Promise<IUser | undefined> {
        const result = await this.userModel.findById(id);
        return result;
    }

    async searchName(name: string): Promise<IUser> {
        const result = await this.userModel.findOne({ username: name });
        return result;
    }

    async searchEmail(email: string): Promise<IUser> {
        const result = await this.userModel.findOne({ email: email });
        return result;
    }

    async delete(id: string) {
        const result = await this.userModel.deleteOne({ _id: id });
        return result;
    }

    async updateCreateBody(username: string, newBodyId: string, rate: number)
        : Promise<IUser> {
        //user of type IUser & Document
        const user = await this.userModel.findOne({ username: username });
        if(user._id === newBodyId){
            throwError(new Error("you are not able to rate yourself"));
        }
        const body = user.bodies.filter(x => x.bodyUserId === newBodyId)[0];
        if (body) {
            body.rate = rate;
        }
        else {
            const newBody: IBody = {
                rate: rate,
                bodyUserId: newBodyId
            };
            user.bodies.push(newBody);
        };
        user.save();
        return user;
    }
}
