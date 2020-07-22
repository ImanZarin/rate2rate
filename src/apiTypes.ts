import { IUser } from "./users/user.model";
import { GetUserInfoResponseResult, GetUserInfoForSignedResponseResult } from "./shared/result.enums";

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
    accessToken: string,
    user: IUser
}

export interface MovieRate {
    _id: string;
    title: string;
    year: number;
    rate: number;

}