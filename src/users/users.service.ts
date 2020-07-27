import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUser, IBody } from './user.model';
import { Model } from 'mongoose';
import passport = require('passport');
import { UpdateBodyResponse } from 'src/apiTypes';
import { UpdateBodyResponseResult } from 'src/shared/result.enums';

@Injectable()
export class UserService {

    constructor(@InjectModel('User') private readonly userModel: Model<IUser>) { }

    async getAll(): Promise<IUser[]> {
        const result = await this.userModel.find().exec();
        return result;
    }

    async create(email: string, pass: string, username: string): Promise<IUser> {
        const sameUserId = await this.searchEmail(email);
        let _username = username;
        if (username.length == 0) {
            _username = email;
        }
        if (!sameUserId) {
            const newUser = new this.userModel({
                username: _username,
                email: email,
                admin: false,
                bodies: [],
                password: pass
            });
            const savedUser: IUser = await newUser.save();
            passport.authenticate('local');
            return savedUser;
        }
        else //user email exist
            return null;
    }

    async find(ids: string[]): Promise<IUser[] | undefined> {
        const result = [];
        for (const id of ids) {
            const r = await this.userModel.findById(id);
            if (r)
                result.push(r);
        }
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

    async updateCreateBody(userId: string, newBodyId: string, rate: number): Promise<UpdateBodyResponse> {
        const user = await this.userModel.findById(userId);
        if (user == null) {
            return {
                result: UpdateBodyResponseResult.userNotFound,
                user: null
            }
        }
        if ((user as IUser)._id == newBodyId) {
            return {
                result: UpdateBodyResponseResult.userIsBody,
                user: user
            }
        }
        const body = (user as IUser).bodies.filter(x => x.bodyUserId === newBodyId)[0];
        const index = (user as IUser).bodies.indexOf(body);
        if (body) {
            (user as IUser).bodies[index].rate = rate;
        }
        else {
            const newBody: IBody = {
                rate: rate,
                bodyUserId: newBodyId
            };
            (user as IUser).bodies.push(newBody);
        };
        user.markModified("bodies");
        user.save();
        return {
            result: UpdateBodyResponseResult.success,
            user: user
        }
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
