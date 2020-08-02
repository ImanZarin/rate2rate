import { Schema, Document } from 'mongoose';

import passportLocalMongoose = require('passport-local-mongoose');

export interface IBuddy {
    buddyId: string;
    rate: number;
    rateDate: string;
}


// const BodySchema: Schema = new Schema({
//     bodyUserId: {
//         type: Schema.Types.ObjectId,
//         ref: "User"
//     },
//     // userId: {
//     //     type: Schema.Types.ObjectId,
//     //     ref: "User"
//     // },
//     rate: {
//         type: Number,
//         min: 1,
//         max: 5
//     }
// });

export interface IUser extends Document {
    _id: string,
    username: string;
    email: string;
    admin: boolean;
    buddies: IBuddy[];
    password: string;
    insertDate: string;
    updateDate: string;
}

export const UserSchema: Schema = new Schema({
    username: {
        type: String,
        default: "",
        required: false
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
    buddies: {
        type: Array,
        default: [],
        required: false
    },
    password: {
        type: String,
        required: true
    },
    insertDate: {
        type: String,
        required: true
    },
    updateDate: {
        type: String,
        required: false
    }
});

UserSchema.plugin(passportLocalMongoose);

//module.exports = mongoose.model<IUser>('User', UserSchema);