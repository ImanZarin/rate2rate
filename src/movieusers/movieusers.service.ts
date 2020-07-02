import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IMovieUser } from './movieusers.model';
import { Model, Document } from 'mongoose';
import { IMovie } from 'src/movies/movie.model';
import { FindForUserResponse, MovieRate } from 'src/apiTypes';
import { UserService } from '../users/users.service';
import { MovieService } from 'src/movies/movies.service';

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

    async findForUser(id: string): Promise<FindForUserResponse> {
        const idList: IMovieUser[] = await this.movieuserModel.find({ userId: id });
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
        const result: FindForUserResponse = {
            user: {
                _id: id,
                name: "test name"
            },
            movies: ratedMovies
        }
        return result;
    }

    async findUserMovies(idList: string[]): Promise<IMovie[]> {
        const result: IMovie[] = await this.movieService.findMovies(idList);
        return result;
    }

    async search(userId: string, movieId: string): Promise<string> {
        const result = await this.movieuserModel.find({ movieId: movieId, userId: userId });
        return result._id;
    }

    async delete(id: string) {
        const result = await this.movieuserModel.deleteOne({ _id: id });
        return result;
    }

    async update(id: string, rate: number)
        : Promise<IMovieUser> {
        const updated: Document = await this.movieuserModel.findById(id);
        if (rate)
            updated.rate = rate;
        updated.save();
        return updated as IMovieUser;
    }
}
