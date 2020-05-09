import {Schema, Document} from 'mongoose';

export interface IBody extends Document {
    _id: string;
    bodyUserId: string;
    userId: string;
    rate: number;
  }


let BodySchema: Schema = new Schema({
    bodyUserId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    rate: {
        type: Number,
        min: 1,
        max: 5
    }
});

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    admin: boolean;
    bodies: [IBody];
  }
  
export const UserSchema: Schema = new Schema({
    firstname: {
        type: String,
        default: ""
    },
    lastname: {
        type: String,
        default: ""
    },
    admin: {
        type: Boolean,
        default: false
    },
    bodies: [BodySchema]
});

//module.exports = mongoose.model<IUser>('User', UserSchema);