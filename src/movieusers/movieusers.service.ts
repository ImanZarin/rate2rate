import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IMovieUser } from './movieusers.model';
import { Model, Document } from 'mongoose';
import { IMovie } from 'src/movies/movie.model';
import { FindForUserResponse, MovieRate } from 'src/apiTypes';
import { UserService} from '../users/users.service';
import { IUser } from 'src/users/user.model';
import { MovieService } from 'src/movies/movies.service';

@Injectable()
export class MovieUserService {
    constructor(@InjectModel('MovieUser') private readonly muModel: Model<IMovieUser>,
        @InjectModel('Movie') private readonly mModel: Model<IMovie>,
        //@InjectModel('User') private readonly uModel: Model<IUser>
        ) {
    }

    async getAll(): Promise<IMovieUser[]> {
        const result = await this.muModel.find().exec();
        return result;
    }

    async create(user: string, rate: number, movie: string): Promise<IMovieUser> {
        const newMovieUser = new this.muModel({
            userId: user,
            movieId: movie,
            rate: rate
        });
        const result = await newMovieUser.save();
        return result;
    }

    async find(id: string): Promise<IMovieUser> {
        const result = await this.muModel.findById(id);
        return result;
    }

    async findForUser(id: string): Promise<FindForUserResponse> {
        const idList: IMovieUser[] = await this.muModel.find({ userId: id });
        const moviesT: IMovie[] = await this.findAllMovies(idList);
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

    async findAllMovies(idList: IMovieUser[]): Promise<IMovie[]> {
        const result: IMovie[] = [];
        for (const i of idList) {
            const r = await this.mModel.findById(i.movieId);
            result.push(r);
        }
        return result;
    }

    async search(userId: string, movieId: string): Promise<string> {
        const result = await this.muModel.find({ movieId: movieId, userId: userId });
        return result._id;
    }

    async delete(id: string) {
        const result = await this.muModel.deleteOne({ _id: id });
        return result;
    }

    async update(id: string, rate: number)
        : Promise<IMovieUser> {
        const updated: Document = await this.muModel.findById(id);
        if (rate)
            updated.rate = rate;
        updated.save();
        return updated as IMovieUser;
    }
}
