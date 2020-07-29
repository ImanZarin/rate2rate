import { IUser, IBuddy } from "./users/user.model";
import { GetUserInfoResponseResult, GetUserInfoForSignedResponseResult, LoginUserResponseResult, 
    UpdateBuddyResponseResult, GetMovieInfoResponseResult, GetMovieInfoForSignedResponseResult, UpdateMovieRateResponseResult, SearchMovieResponseResult, GetProfileInfoResponseResult } from "./shared/result.enums";
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
    rateDate: string;
}

export interface UserRate {
    buddyId: string;
    buddyName: string;
    rate: number;
    rateDate: string;
}

export interface UpdateBuddyResponse {
    result: UpdateBuddyResponseResult,
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

export interface GetProfileInfoResponse {
    result: GetProfileInfoResponseResult,
    movies: MovieRate[],
    buddies: UserRate[],
    me: IUser
}