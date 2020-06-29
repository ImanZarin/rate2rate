import { Schema } from 'mongoose';
import { Constants } from '../../app.constants';
import { Document } from 'mongoose';

export interface IMovieUser extends Document {
    _id: string;
    userId: string;
    rate: number;
    movieId: string;
}

export const MovieUserSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    movieId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    rate: {
        type: Number,
        required: true,
        min: Constants.minMovieRate,
        max: Constants.maxMovieRate
    }
});
