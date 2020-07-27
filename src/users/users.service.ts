import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUser, IBuddy } from './user.model';
import { Model } from 'mongoose';
import passport = require('passport');
import { UpdateBuddyResponse } from 'src/apiTypes';
import { UpdateBuddyResponseResult } from 'src/shared/result.enums';

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

    async updateCreateBuddy(userId: string, newBuddyId: string, rate: number): Promise<UpdateBuddyResponse> {
        const user = await this.userModel.findById(userId);
        if (user == null) {
            return {
                result: UpdateBuddyResponseResult.userNotFound,
                user: null
            }
        }
        if ((user as IUser)._id == newBuddyId) {
            return {
                result: UpdateBuddyResponseResult.userIsBuddy,
                user: user
            }
        }
        const buddy = (user as IUser).buddies.filter(x => x.buddyId === newBuddyId)[0];
        const index = (user as IUser).buddies.indexOf(buddy);
        if (buddy) {
            (user as IUser).buddies[index].rate = rate;
            (user as IUser).buddies[index].timeStamp = (new Date()).toUTCString();
        }
        else {
            const newBuddyName = (await this.find([newBuddyId]))[0].username;
            const newBuddy: IBuddy = {
                rate: rate,
                buddyName: newBuddyName,
                buddyId: newBuddyId,
                timeStamp: (new Date()).toUTCString()
            };
            (user as IUser).buddies.push(newBuddy);
        };
        user.markModified("buddies");
        user.save();
        return {
            result: UpdateBuddyResponseResult.success,
            user: user
        }
    }

    async deleteBuddies(id: string): Promise<IUser> {
        const user = await this.userModel.findById(id);
        if (user) {
            user.buddies = [];
            user.markModified("buddies");
            user.save();
        }
        return user;
    }

}
