import mongoose, {Schema, Document} from 'mongoose';

export interface IBody extends Document {
    bodyUserId: string;
    userId: string;
    rate: number;
  }


let BodyScema: Schema = new Schema({
    bodyUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
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
  
let UserSchema: Schema = new Schema({
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
    bodies: [BodyScema]
});

module.exports = mongoose.model<IUser>('User', UserSchema);