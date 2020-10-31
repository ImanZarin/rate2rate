import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUser, IBuddy } from './user.model';
import { Model } from 'mongoose';
import passport = require('passport');
import { UpdateBuddyResponse } from 'src/shared/apiTypes';
import { UpdateBuddyResponseResult } from 'src/shared/result.enums';
import { User } from 'src/shared/dto.models';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {

    constructor(@InjectModel('User') private readonly userModel: Model<IUser>) { }

    async getAll(): Promise<IUser[]> {
        const result = await this.userModel.find().exec();
        return result;
    }

    async create(email: string, pass: string, username: string, notiftoken?: string): Promise<IUser> {
        const sameUserId = await this.searchEmail(email);
        let _username = username;
        if (username.length == 0) {
            _username = email;
        }
        if (!sameUserId) {
            const hashedpass = await hash(pass, 10);
            const newUser = new this.userModel({
                username: _username,
                email: email,
                admin: false,
                bodies: [],
                password: hashedpass,
                notiftoken: notiftoken,
                insertDate: (new Date()).toISOString()
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

    async getUserDTO(user: IUser): Promise<User> {
        const buddies = await this.find(user.buddies.map(a => a.buddyId));
        const buddiesRated = buddies.map(b => ({
            userId: user.id,
            userName: user.username,
            buddyId: b._id.toString(),
            rate: user.buddies.filter(c => c.buddyId.toString() === b._id.toString())[0].rate,
            buddyName: b.username,
            rateDate: user.buddies.filter(c => c.buddyId.toString() === b._id.toString())[0].rateDate,
        }));
        const buddiesRatedSorted = buddiesRated.sort((a, b) => a.rateDate > b.rateDate ? -1 : 1);
        return {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            buddies: buddiesRatedSorted
        }
    }

    async getUserBuddies(id: string): Promise<IUser[]> {
        const user = await this.userModel.findById(id);
        const buddies = await this.find(user.buddies.map(a => a.buddyId));
        return buddies;
    }

    async updateCreateBuddy(userId: string, newBuddyId: string, rate: number): Promise<UpdateBuddyResponse> {
        const user = await this.userModel.findById(userId);
        if (user == null) {
            return {
                result: UpdateBuddyResponseResult.userNotFound,
                user: null
            }
        }
        if (user._id.toString() == newBuddyId)
            return {
                result: UpdateBuddyResponseResult.userIsBuddy,
                user: await this.getUserDTO(user)
            }
        const buddy = (user as IUser).buddies.filter(x => x.buddyId === newBuddyId)[0];
        const index = (user as IUser).buddies.indexOf(buddy);
        if (buddy) {
            (user as IUser).buddies[index].rate = rate;
            (user as IUser).buddies[index].rateDate = (new Date()).toISOString();
        }
        else {
            const newBuddy: IBuddy = {
                rate: rate,
                buddyId: newBuddyId,
                rateDate: (new Date()).toISOString()
            };
            (user as IUser).buddies.push(newBuddy);
        };
        user.updateDate = (new Date()).toISOString();
        user.markModified("buddies");
        user.save();
        return {
            result: UpdateBuddyResponseResult.success,
            user: await this.getUserDTO(user)
        }
    }

    async updateNotificationToken(userId: string, notifToken: string): Promise<boolean> {
        const user = await this.userModel.findById(userId);
        if (user == null)
            return false;
        if (user.notiftoken.indexOf(notifToken) > 0)
            return false;
        user.notiftoken.push(notifToken);
        user.save();
        return true;
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

    async searchAll(search: string): Promise<User[]> {
        //no name is less than 4 character
        if (search.length < 3)
            return [];
        await this.userModel.init();
        const r: IUser[] = await this.userModel.find({ $text: { $search: search } });
        //const r: IUser[] = [];
        return r.map(res => ({
            id: res._id.toString(),
            username: res.username,
            email: res.email,
            buddies: []
        }));
    }

}
