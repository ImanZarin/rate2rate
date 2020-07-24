import { IUser } from "./users/user.model";
import { GetUserInfoResponseResult, GetUserInfoForSignedResponseResult, LoginUserResponseResult, UpdateBodyResponseResult, GetMovieInfoResponseResult, GetMovieInfoForSignedResponseResult } from "./shared/result.enums";
import { IMovie } from "./movies/movie.model";

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