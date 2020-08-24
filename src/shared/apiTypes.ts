import {
    GetUserInfoResponseResult, GetUserInfoForSignedResponseResult, LoginUserResponseResult,
    UpdateBuddyResponseResult, GetMovieInfoResponseResult, GetMovieInfoForSignedResponseResult,
    UpdateMovieRateResponseResult, SearchResponseResult, GetProfileInfoResponseResult, GetRecentRatesResponseResult, GetRecentRatesForSignedResponseResult
} from "./result.enums";
import { IMDBsearch } from "../movies/movie.model";
import { MovieRate, UserRate, User, Movie, MovieSuggest } from "./dto.models";

export interface GetUserInfoResponse {
    result: GetUserInfoResponseResult,
    user: User,
    movies: MovieRate[],
}

export interface GetUserInfoForSignedResponse {
    result: GetUserInfoForSignedResponseResult,
    user: User,
    movies: MovieRate[],
    buddy: UserRate
}

export interface LoginUserResponse {
    result: LoginUserResponseResult,
    accessToken: string,
    user: User
}

export interface UpdateBuddyResponse {
    result: UpdateBuddyResponseResult,
    user: User
}

export interface GetMovieInfoResponse {
    result: GetMovieInfoResponseResult,
    movie: Movie,
    users: MovieRate[],
}

export interface GetMovieInfoForSignedResponse {
    result: GetMovieInfoForSignedResponseResult,
    movie: Movie,
    users: MovieRate[],
    myRate: MovieRate
    myLikebility: number
}

export interface UpdateMovieRateResponse {
    result: UpdateMovieRateResponseResult,
    movieuser: MovieRate
}

export interface SearchResponse {
    result: SearchResponseResult,
    movies: IMDBsearch[],
    users: User[]
}

export interface GetProfileInfoResponse {
    result: GetProfileInfoResponseResult,
    movies: MovieRate[],
    buddies: UserRate[],
    me: User
}

export interface GetRecentRatesResponse {
    result: GetRecentRatesResponseResult,
    movies: MovieRate[]
}

export interface GetRecentRatesForSignedResponse {
    result: GetRecentRatesForSignedResponseResult,
    movies: MovieRate[],
    suggests: MovieSuggest[],
}