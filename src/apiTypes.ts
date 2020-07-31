import { IUser } from "./users/user.model";
import { GetUserInfoResponseResult, GetUserInfoForSignedResponseResult, LoginUserResponseResult, UpdateBodyResponseResult, GetMovieInfoResponseResult, GetMovieInfoForSignedResponseResult, UpdateMovieRateResponseResult, SearchMovieResponseResult, GetRecentRatesResponseResult } from "./shared/result.enums";
import { IMovie, IMDBsearch } from "./movies/movie.model";
import { IMovieUser } from "./movieusers/movieusers.model";

export interface GetUserInfoResponse {
    result: GetUserInfoResponseResult,
    user: IUser,
    movies: MovieRate[],
}

export interface GetUserInfoForSignedResponse {
    result: GetUserInfoForSignedResponseResult,
    user: IUser,
    movies: MovieRate[],
    rate: number
}

export interface LoginUserResponse {
    result: LoginUserResponseResult,
    accessToken: string,
    user: IUser
}

export interface MovieRate {
    _id: string;
    title: string;
    year: number;
    rate: number;
}

export interface UserRate {
    _id: string;
    name: string;
    rate: number;
}

export interface UpdateBodyResponse {
    result: UpdateBodyResponseResult,
    user: IUser
}

export interface GetMovieInfoResponse {
    result: GetMovieInfoResponseResult,
    movie: IMovie,
    users: UserRate[],
}

export interface GetMovieInfoForSignedResponse {
    result: GetMovieInfoForSignedResponseResult,
    movie: IMovie,
    users: UserRate[],
    rate: number
}

export interface UpdateMovieRateResponse {
    result: UpdateMovieRateResponseResult,
    movieuser: IMovieUser
}

export interface SearchMovieResponse {
    result: SearchMovieResponseResult,
    movies: IMDBsearch[]
}

export interface MovieUserNames {
    movieId: string;
    userId: string;
    movieTitle: string;
    userName: string;
    rate: number;
}

export interface GetRecentRatesResponse {
    result: GetRecentRatesResponseResult,
    movies: MovieUserNames[],
    suggestions: MovieUserNames[]
}