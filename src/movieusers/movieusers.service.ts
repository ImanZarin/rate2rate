import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IMovieUser } from './movieusers.model';
import { Model, Document } from 'mongoose';
import { IMovie } from 'src/movies/movie.model';
import { GetUserInfoResponse, MovieRate, GetUserInfoForSignedResponse, GetMovieInfoResponse, UserRate, GetMovieInfoForSignedResponse, UpdateMovieRateResponse } from 'src/apiTypes';
import { UserService } from '../users/users.service';
import { MovieService } from 'src/movies/movies.service';
import { IUser, IBody } from 'src/users/user.model';
import { GetUserInfoResponseResult, GetUserInfoForSignedResponseResult, GetMovieInfoResponseResult, GetMovieInfoForSignedResponseResult, UpdateMovieRateResponseResult } from 'src/shared/result.enums';

@Injectable()
export class MovieUserService {
    constructor(@InjectModel('MovieUser') private readonly movieuserModel: Model<IMovieUser>,
        private readonly movieService: MovieService,
        private readonly userService: UserService
    ) {
    }

    async getAll(): Promise<IMovieUser[]> {
        const result = await this.movieuserModel.find().exec();
        return result;
    }

    async create(user: string, rate: number, movie: string): Promise<UpdateMovieRateResponse> {
        const newMovieUser = new this.movieuserModel({
            userId: user,
            movieId: movie,
            rate: rate
        });
        const res = await newMovieUser.save();
        return {
            result: UpdateMovieRateResponseResult.success,
            movieuser: res
        };
    }

    async find(id: string): Promise<IMovieUser> {
        const result = await this.movieuserModel.findById(id);
        return result;
    }

    async findForUser(id: string): Promise<GetUserInfoResponse> {
        const idList: IMovieUser[] = await this.movieuserModel.find({ userId: id });
        const user: IUser = (await this.userService.find([id]))[0];
        if (!user) {
            return {
                result: GetUserInfoResponseResult.userNotFound,
                user: null,
                movies: []
            }
        }
        if (idList.length < 1) {
            return {
                result: GetUserInfoResponseResult.listEmpty,
                user: user,
                movies: []
            }
        }
        const moviesT: IMovie[] = await this.findUserMovies(idList.map(a => a.movieId.toString()));
        const ratedMovies: MovieRate[] = [];
        for (const m of moviesT) {
            const r = idList.find(mu => mu.movieId.toString() == m._id.toString()).rate;
            ratedMovies.push({
                _id: m._id,
                title: m.title,
                year: m.year,
                rate: r
            });
        }
        if (ratedMovies.length < 1) {
            return {
                result: GetUserInfoResponseResult.listEmpty,
                user: user,
                movies: []
            }
        }
        return {
            result: GetUserInfoResponseResult.success,
            user: user,
            movies: ratedMovies
        }
    }

    async findForUserExtra(id: string, signedName: string): Promise<GetUserInfoForSignedResponse> {
        const re1: GetUserInfoResponse = await this.findForUser(id);
        let _rate = 0;
        if (re1.result == GetUserInfoResponseResult.userNotFound) {
            return {
                result: GetUserInfoForSignedResponseResult.userNotFound,
                user: null,
                movies: [],
                rate: _rate
            }
        }
        const signedUser: IUser = await this.userService.searchEmail(signedName);
        const _body: IBody = signedUser.bodies.filter(x => x.bodyUserId == id)[0];
        if (_body)
            _rate = _body.rate;
        if (re1.result == GetUserInfoResponseResult.listEmpty) {
            return {
                result: GetUserInfoForSignedResponseResult.listEmpty,
                user: re1.user,
                movies: [],
                rate: _rate
            }
        }
        return {
            result: GetUserInfoForSignedResponseResult.success,
            user: re1.user,
            movies: re1.movies,
            rate: _rate
        }
    }

    async findForMovie(id: string): Promise<GetMovieInfoResponse> {
        const idList: IMovieUser[] = await this.movieuserModel.find({ movieId: id });
        const movie: IMovie = await this.movieService.find(id);
        if (!movie) {
            return {
                result: GetMovieInfoResponseResult.movieNotFound,
                movie: null,
                users: []
            }
        }
        if (idList.length < 1) {
            return {
                result: GetMovieInfoResponseResult.listEmpty,
                movie: movie,
                users: []
            }
        }
        const usersT: IUser[] = await this.userService.find(idList.map(a => a.userId.toString()));
        const userRated: UserRate[] = [];
        for (const u of usersT) {
            const r = idList.find(mu => mu.userId.toString() == u._id.toString()).rate;
            userRated.push({
                _id: u._id,
                name: u.username,
                rate: r
            });
        }
        if (userRated.length < 1) {
            return {
                result: GetMovieInfoResponseResult.listEmpty,
                movie: movie,
                users: []
            }
        }
        return {
            result: GetMovieInfoResponseResult.success,
            movie: movie,
            users: userRated
        }
    }

    async findForMovieExtra(id: string, signedName: string): Promise<GetMovieInfoForSignedResponse> {
        const re1: GetMovieInfoResponse = await this.findForMovie(id);
        let _rate = 0;
        if (re1.result == GetMovieInfoResponseResult.movieNotFound) {
            return {
                result: GetMovieInfoForSignedResponseResult.movieNotFound,
                movie: null,
                users: [],
                rate: _rate
            }
        }
        const signedUser = await this.userService.searchEmail(signedName);
        const signedUserRate: IMovieUser = await this.search(signedUser._id, id);
        let updatedUsers: UserRate[] = re1.users;
        if (signedName && signedUserRate) {
            _rate = signedUserRate.rate;
            updatedUsers = re1.users.filter(u => u._id.toString() != signedUser._id.toString());
        }
        if (re1.result == GetMovieInfoResponseResult.listEmpty || updatedUsers.length < 1) {
            return {
                result: GetMovieInfoForSignedResponseResult.listEmpty,
                movie: re1.movie,
                users: [],
                rate: _rate
            }
        }
        return {
            result: GetMovieInfoForSignedResponseResult.success,
            movie: re1.movie,
            users: updatedUsers,
            rate: _rate
        }
    }

    async findUserMovies(idList: string[]): Promise<IMovie[]> {
        const result: IMovie[] = await this.movieService.findMovies(idList);
        return result;
    }

    async search(userId: string, movieId: string): Promise<IMovieUser> {
        const result = await this.movieuserModel.find({ movieId: movieId, userId: userId });
        return result[0];
    }

    async delete(id: string) {
        const result = await this.movieuserModel.deleteOne({ _id: id });
        return result;
    }

    async deleteAll() {
        const result = await this.movieuserModel.deleteMany({});
        return result;
    }

    async update(id: string, rate: number)
        : Promise<UpdateMovieRateResponse> {
        const updated: IMovieUser = await this.movieuserModel.findById(id);
        if (!updated)
            return {
                result: UpdateMovieRateResponseResult.movieuserNotFound,
                movieuser: null
            }
        if (rate)
            updated.rate = rate;
        updated.save();
        return {
            result: UpdateMovieRateResponseResult.success,
            movieuser: updated
        }
    }
}
