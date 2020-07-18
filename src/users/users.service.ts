import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUser, IBody } from './user.model';
import { Model } from 'mongoose';
import passport = require('passport');
import { use } from 'passport';

@Injectable()
export class UserService {

    constructor(@InjectModel('User') private readonly userModel: Model<IUser>) { }

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
        const user: IUser = await this.userModel.findOne({ username: username });
        console.log("pre user: ", user);
        if (user == null) {
            console.log("this user does not exist");
            return null;
        }
        if (user._id == newBodyId) {
            console.log("you are not able to rate yourself");
            return null;
        }
        const body = user.bodies.filter(x => x.bodyUserId === newBodyId)[0];
        const index = user.bodies.indexOf(body);
        if (body) {
            user.bodies[index].rate = rate;
        }
        else {
            const newBody: IBody = {
                rate: rate,
                bodyUserId: newBodyId
            };
            user.bodies.push(newBody);
        };
        (user as any).save();
        const user2: IUser = await this.userModel.findOne({ username: username });
        console.log("next user2: ", user2);
        return user;
    }

    async deleteBodies(id: string): Promise<IUser> {
        const user = await this.userModel.findById(id);
        if (user) {
            user.bodies = [];
            user.save();
        }
        return user;
    }
}
