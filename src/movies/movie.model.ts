import * as mongoose from 'mongoose';

export interface IMovie extends Document {
    title: string;
    year: number;
    brief: string;
    imageUrl: string;
    genre: string[];
    cast: string[];
};

export const MovieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        default: ""
    },
    year: {
        type: Number,
        required: true,
        min: Constants.minMovieYear,
        max: Constants.maxMovieYear
    },
    brief: {
        type: String,
        default: ""
    },
    imageUrl: {
        type: String,
    },
    genre: [{
        type: String,
    }],
    cast: [{
        type: String,
    }],
});
