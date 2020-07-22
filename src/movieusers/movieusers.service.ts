import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IMovieUser } from './movieusers.model';
import { Model, Document } from 'mongoose';
import { IMovie } from 'src/movies/movie.model';
import { GetUserInfoResponse, MovieRate, GetUserInfoForSignedResponse } from 'src/apiTypes';
import { UserService } from '../users/users.service';
import { MovieService } from 'src/movies/movies.service';
import { IUser, IBody } from 'src/users/user.model';
import { GetUserInfoResponseResult, GetUserInfoForSignedResponseResult } from 'src/shared/result.enums';

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

    async create(user: string, rate: number, movie: string): Promise<IMovieUser> {
        const newMovieUser = new this.movieuserModel({
            userId: user,
            movieId: movie,
            rate: rate
        });
        const result = await newMovieUser.save();
        return result;
    }

    async find(id: string): Promise<IMovieUser> {
        const result = await this.movieuserModel.findById(id);
        return result;
    }

    async findForUser(id: string): Promise<GetUserInfoResponse> {
        const idList: IMovieUser[] = await this.movieuserModel.find({ userId: id });
        const user: IUser = await this.userService.find(id);
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

    async findUserMovies(idList: string[]): Promise<IMovie[]> {
        const result: IMovie[] = await this.movieService.findMovies(idList);
        return result;
    }

    async search(userId: string, movieId: string): Promise<string> {
        const result = await this.movieuserModel.find({ movieId: movieId, userId: userId })[0];
        return result._id;
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
        : Promise<IMovieUser> {
        const updated: IMovieUser = await this.movieuserModel.findById(id);
        if (rate)
            updated.rate = rate;
        updated.save();
        return updated as IMovieUser;
    }
}
