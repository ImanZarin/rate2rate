import * as mongoose from 'mongoose';
import { Constants } from '../app.constants';
import { Document } from 'mongoose';

export interface IMovie extends Document {
    _id: string;
    title: string;
    year: number;
    brief: string;
    imageUrl: string;
    genre: string[];
    cast: string[];
    director: string[];
    imdbId: string;
    insertDate: string;
    updateDate: string;
    duration: number;
    release: string | null;
}

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
    director: [{
        type: String,
    }],
    imdbId: {
        type: String,
    },
    insertDate: {
        type: String,
        required: true
    },
    updateDate: {
        type: String,
        required: false
    },
    duration: {
        type: Number
    },
    release: {
        type: String
    }
});

export interface IMDBsearch {
    Title: string;
    Year: number;
    imdbID: string;
    Poster: string;
}

export interface IMDBmovie {
    Title: string;
    Year: number;
    Rated: string;
    Released: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Awards: string;
    Poster: string;
    Ratings: [];
    Metascore: number;
    imdbRating: number;
    imdbVotes: number;
    imdbID: string;
    Type: string;
    DVD: string;
    BoxOffice: string;
    Production: string;
    Website: string;
    Response: string;
}
