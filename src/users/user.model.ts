import { Schema, Document } from 'mongoose';

import passportLocalMongoose = require('passport-local-mongoose');

export interface IBody extends Document {
    //_id: string;
    bodyUserId: string;
    //userId: string;
    rate: number;
}


const BodySchema: Schema = new Schema({
    bodyUserId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    // userId: {
    //     type: Schema.Types.ObjectId,
    //     ref: "User"
    // },
    rate: {
        type: Number,
        min: 1,
        max: 5
    }
});

export interface IUser extends Document {
    _id: string,
    username: string;
    email: string;
    admin: boolean;
    bodies: [IBody];
    password: string;
}

export const UserSchema: Schema = new Schema({
    username: {
        type: String,
        default: "",
        required: true
    },
    email: {
        type: String,
        default: "",
        required: true
    },
    admin: {
        type: Boolean,
        default: false,
        required: true
    },
    bodies: [BodySchema],
    password: {
        type: String,
        default: "",
    }
});

UserSchema.plugin(passportLocalMongoose);

//module.exports = mongoose.model<IUser>('User', UserSchema);