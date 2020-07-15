import { IUser } from "./users/user.model";

export interface GetUserInfoResponse {
    user: IUser,
    movies: MovieRate[],
}

export interface GetUserInfoForSignedResponse {
    userAndMovies: GetUserInfoResponse,
    rate: number
}

export interface MovieRate {
    _id: string;
    title: string;
    year: number;
    rate: number;

}