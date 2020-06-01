import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from './user.model';
import { Model } from 'mongoose';

@Injectable()
export class UserService {

    constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {

    }

    async getAll(): Promise<IUser[]> {
        const result = await this.userModel.find().exec();
        return result;
    }

    async create(username: string, email: string): Promise<string> {
        let sameUserId = await this.searchName(username);
        if (!sameUserId)
            sameUserId = await this.searchEmail(email);
        if (!sameUserId) {
            const newUser = new this.userModel({
                username: username,
                email: email,
                admin: false,
                bodies: []
            });
            const result = await newUser.save();
            return result.id as string;
        }
        else //user with same name exist
            return null;
    }

    async find(id: string): Promise<IUser> {
        const result = await this.userModel.findById(id);
        return result;
    }

    async searchName(name: string): Promise<string> {
        const result = await this.userModel.findOne({ username: name });
        return result._id as string;
    }

    async searchEmail(email: string): Promise<string> {
        const result = await this.userModel.findOne({ email: email });
        return result._id as string;
    }

    async delete(id: string) {
        const result = await this.userModel.deleteOne({ _id: id });
        return result;
    }

    async update(id: string, newBodyId: string)
        : Promise<IUser> {

        const updated = await this.userModel.findById(id);
        updated.bodies.push(newBodyId);
        updated.save();
        return updated;
    }
}
