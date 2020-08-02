import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IMovieUser } from './movieusers.model';
import { Model } from 'mongoose';
import { IMovie } from 'src/movies/movie.model';
import { GetUserInfoResponse, GetUserInfoForSignedResponse, GetMovieInfoResponse, GetMovieInfoForSignedResponse, UpdateMovieRateResponse, GetProfileInfoResponse, GetRecentRatesResponse, GetRecentRatesForSignedResponse } from 'src/shared/apiTypes';
import { UserService } from '../users/users.service';
import { MovieService } from 'src/movies/movies.service';
import { IUser } from 'src/users/user.model';
import { GetUserInfoResponseResult, GetUserInfoForSignedResponseResult, GetMovieInfoResponseResult, GetMovieInfoForSignedResponseResult, UpdateMovieRateResponseResult, GetProfileInfoResponseResult, GetRecentRatesResponseResult, GetRecentRatesForSignedResponseResult } from 'src/shared/result.enums';
import { MovieRate, MovieSuggest } from 'src/shared/dto.models';

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
        const now = new Date();
        const newMovieUser = new this.movieuserModel({
            userId: user,
            movieId: movie,
            rate: rate,
            insertDate: now.toISOString(),
            updateDate: now.toISOString()
        });
        const res = await newMovieUser.save();
        return {
            result: UpdateMovieRateResponseResult.success,
            movieuser: {
                movieId: res.movieId,
                movieTitle: await (await this.movieService.find([movie]))[0].title,
                userId: res.userId,
                userName: await (await this.userService.find([user]))[0].username,
                rate: rate,
                rateDate: res.updateDate
            }
        };
    }

    async find(id: string): Promise<IMovieUser> {
        const result = await this.movieuserModel.findById(id);
        return result;
    }

    async findMoviesForUser(id: string): Promise<GetUserInfoResponse> {
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
                user: {
                    username: user.username,
                    id: user._id,
                    email: user.email,
                    buddies: await (await this.userService.getUserDTO(user)).buddies
                },
                movies: []
            }
        }
        const moviesT: IMovie[] = await this.findUserMovies(idList.map(a => a.movieId.toString()));
        const ratedMovies: MovieRate[] = moviesT.map(m => ({
            movieId: m._id,
            movieTitle: m.title,
            userName: user.username,
            userId: user._id,
            rate: idList.filter(mu => mu.movieId.toString() == m._id.toString())[0].rate,
            rateDate: idList.filter(mu => mu.movieId.toString() == m._id.toString())[0].updateDate
        }));
        if (ratedMovies.length < 1) {
            return {
                result: GetUserInfoResponseResult.listEmpty,
                user: {
                    username: user.username,
                    id: user._id,
                    email: user.email,
                    buddies: []
                },
                movies: []
            }
        }
        ratedMovies.sort((a, b) => a.rateDate > b.rateDate ? -1 : 1);
        return {
            result: GetUserInfoResponseResult.success,
            user: {
                username: user.username,
                id: user._id,
                email: user.email,
                buddies: []
            },
            movies: ratedMovies
        }
    }

    async findMoviesForUserExtra(id: string, signedName: string): Promise<GetUserInfoForSignedResponse> {
        const re1: GetUserInfoResponse = await this.findMoviesForUser(id);
        if (re1.result == GetUserInfoResponseResult.userNotFound) {
            return {
                result: GetUserInfoForSignedResponseResult.userNotFound,
                user: null,
                movies: [],
                buddy: null
            }
        }
        const signedUser: IUser = await this.userService.searchEmail(signedName);
        if (re1.result == GetUserInfoResponseResult.listEmpty) {
            return {
                result: GetUserInfoForSignedResponseResult.listEmpty,
                user: re1.user,
                movies: [],
                buddy: {
                    userId: signedUser._id,
                    userName: signedUser.username,
                    buddyId: re1.user.id,
                    buddyName: re1.user.username,
                    rate: signedUser.buddies.filter(x => x.buddyId == re1.user.id)[0].rate,
                    rateDate: signedUser.buddies.filter(x => x.buddyId == re1.user.id)[0].rateDate
                }
            }
        }
        return {
            result: GetUserInfoForSignedResponseResult.success,
            user: re1.user,
            movies: re1.movies,
            buddy: {
                userId: signedUser._id,
                userName: signedUser.username,
                buddyId: re1.user.id,
                buddyName: re1.user.username,
                rate: signedUser.buddies.filter(x => x.buddyId == re1.user.id)[0].rate,
                rateDate: signedUser.buddies.filter(x => x.buddyId == re1.user.id)[0].rateDate
            }
        }
    }

    async findForMovie(id: string): Promise<GetMovieInfoResponse> {
        const idList: IMovieUser[] = await this.movieuserModel.find({ movieId: id });
        const movie: IMovie = await this.movieService.find([id])[0];
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
                movie: {
                    actors: movie.cast,
                    director: movie.director,
                    genre: movie.genre,
                    poster: movie.imageUrl,
                    title: movie.title,
                    year: movie.year,
                    plot: movie.brief
                },
                users: []
            }
        }
        const usersT: IUser[] = await this.userService.find(idList.map(a => a.userId.toString()));
        const userRated: MovieRate[] = usersT.map(u => ({
            userId: u._id,
            userName: u.username,
            movieId: movie._id,
            movieTitle: movie.title,
            rate: idList.find(mu => mu.userId.toString() == u._id.toString()).rate,
            rateDate: idList.find(mu => mu.userId.toString() == u._id.toString()).updateDate
        }));
        if (userRated.length < 1) {
            return {
                result: GetMovieInfoResponseResult.listEmpty,
                movie: {
                    actors: movie.cast,
                    director: movie.director,
                    genre: movie.genre,
                    poster: movie.imageUrl,
                    title: movie.title,
                    year: movie.year,
                    plot: movie.brief
                },
                users: []
            }
        }
        return {
            result: GetMovieInfoResponseResult.success,
            movie: {
                actors: movie.cast,
                director: movie.director,
                genre: movie.genre,
                poster: movie.imageUrl,
                title: movie.title,
                year: movie.year,
                plot: movie.brief
            },
            users: userRated
        }
    }

    async findForMovieExtra(id: string, signedId: string): Promise<GetMovieInfoForSignedResponse> {
        const re1: GetMovieInfoResponse = await this.findForMovie(id);
        if (re1.result == GetMovieInfoResponseResult.movieNotFound) {
            return {
                result: GetMovieInfoForSignedResponseResult.movieNotFound,
                movie: null,
                users: [],
                myRate: null
            }
        }
        const signedUser: IUser = await this.userService.find([signedId])[0];
        if (!signedUser)
            return {
                result: GetMovieInfoForSignedResponseResult.userFake,
                movie: re1.movie,
                users: [],
                myRate: null
            }
        const signedUserRate: IMovieUser = await this.search(signedUser._id, id);
        let updatedUsers: MovieRate[] = re1.users;
        if (signedId && signedUserRate) {
            updatedUsers = re1.users.filter(u => u.userId.toString() != signedUser._id.toString());
        }
        if (re1.result == GetMovieInfoResponseResult.listEmpty || updatedUsers.length < 1) {
            return {
                result: GetMovieInfoForSignedResponseResult.listEmpty,
                movie: re1.movie,
                users: [],
                myRate: {
                    userName: signedUser.username,
                    userId: signedUser._id,
                    movieId: id,
                    movieTitle: re1.movie.title,
                    rate: signedUserRate.rate,
                    rateDate: signedUserRate.updateDate
                }
            }
        }
        return {
            result: GetMovieInfoForSignedResponseResult.success,
            movie: re1.movie,
            users: updatedUsers,
            myRate: {
                userName: signedUser.username,
                userId: signedUser._id,
                movieId: id,
                movieTitle: re1.movie.title,
                rate: signedUserRate.rate,
                rateDate: signedUserRate.updateDate
            }
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

    private async getNameAndTitle(movieUsers: IMovieUser[]): Promise<MovieRate[]> {
        const userIds = movieUsers.map(mu => mu.userId);
        const users = await this.userService.find(userIds);
        const movieIds = movieUsers.map(mu => mu.movieId);
        const movies = await this.movieService.find(movieIds);
        const result = movieUsers.map(mu => ({
            movieId: mu.movieId,
            userId: mu.userId,
            movieTitle: movies.filter(m => m._id.toString() == mu.movieId)[0]?.title,
            userName: users.filter(u => u._id.toString() == mu.userId)[0]?.username,
            rate: mu.rate,
            rateDate: mu.updateDate
        }));
        return result;
    }

    async findRecent(): Promise<GetRecentRatesResponse> {
        const re: IMovieUser[] = await this.getAll();
        re.slice(0, 9);
        if (!re)
            return {
                result: GetRecentRatesResponseResult.noMovie,
                movies: [],
            }
        const movieRateWithNames = await this.getNameAndTitle(re);
        const movieRateWithNamesSorted = movieRateWithNames.sort((a, b) => a.rateDate > b.rateDate ? -1 : 1);
        if (!movieRateWithNamesSorted)
            return {
                result: GetRecentRatesResponseResult.noMovie,
                movies: [],
            }
        return {
            result: GetRecentRatesResponseResult.success,
            movies: movieRateWithNamesSorted,
        }
    }

    async findRecentExtra(id: string): Promise<GetRecentRatesForSignedResponse> {
        const re = await this.findRecent();
        if (re.result === GetRecentRatesResponseResult.noMovie)
            return {
                result: GetRecentRatesForSignedResponseResult.noMovie,
                movies: [],
                suggests: []
            }
        const sug = await this.suggest(id);
        if (!sug || sug.length < 1)
            return {
                result: GetRecentRatesForSignedResponseResult.noSuggest,
                movies: re.movies,
                suggests: []
            }
        return {
            result: GetRecentRatesForSignedResponseResult.success,
            movies: re.movies,
            suggests: sug
        }
    }

    async suggest(userId: string): Promise<MovieSuggest[]> {
        const user: IUser = (await this.userService.find([userId]))[0];
        const allMovieUsers = await this.movieuserModel.find({ userId: { $in: user.buddies.map(b => b.buddyId) } });
        const allMovieSuggest: MovieSuggest[] = [];
        allMovieUsers.forEach(mu => {
            const i = allMovieSuggest.findIndex(a => a.movieId == mu.movieId);
            if (i >= 0) {
                allMovieSuggest[i].rates.push(mu.rate);
            }
            else {
                allMovieSuggest.push({
                    movieId: mu.movieId,
                    movieTitle: "",
                    rates: [(mu.rate - 2) * (user.buddies.filter(b => b.buddyId.toString() == mu.userId)[0].rate - 2)],
                    likeability: 0
                });
            }
        });
        const movies: IMovie[] = await this.movieService.find(allMovieSuggest.map(m => m.movieId));
        const preResult: MovieSuggest[] = allMovieSuggest.map(m => ({
            movieId: m.movieId,
            movieTitle: movies.filter(n => n._id.toString() == m.movieId)[0].title,
            rates: m.rates,
            likeability: this.calculateLikeability(m.rates)
        }));
        return preResult.filter(r => r.likeability > 80);
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
        if (rate) {
            updated.rate = rate;
            updated.updateDate = (new Date()).toISOString();
        }
        updated.save();
        return {
            result: UpdateMovieRateResponseResult.success,
            movieuser: {
                movieId: updated.movieId,
                movieTitle: (await (await this.movieService.find([updated.movieId]))[0].title),
                userId: updated.userId,
                userName: (await this.userService.find([updated.userId]))[0].username,
                rate: updated.rate,
                rateDate: updated.updateDate
            }
        }
    }

    async getProfileInfo(userId: string): Promise<GetProfileInfoResponse> {
        const userInfo = await this.findMoviesForUser(userId);
        if (userInfo.result == GetUserInfoResponseResult.userNotFound)
            return {
                result: GetProfileInfoResponseResult.noUser,
                movies: [],
                buddies: [],
                me: null
            }
        if (userInfo.user.buddies.length < 1 && userInfo.result == GetUserInfoResponseResult.listEmpty)
            return {
                result: GetProfileInfoResponseResult.noMovienoBuddy,
                movies: [],
                buddies: [],
                me: userInfo.user
            }
        if (userInfo.user.buddies.length < 1)
            return {
                result: GetProfileInfoResponseResult.noBuddy,
                movies: userInfo.movies,
                buddies: [],
                me: userInfo.user
            }
        if (userInfo.result == GetUserInfoResponseResult.listEmpty)
            return {
                result: GetProfileInfoResponseResult.noMovie,
                movies: [],
                buddies: userInfo.user.buddies,
                me: userInfo.user
            }
        if (userInfo.result == GetUserInfoResponseResult.success)
            return {
                result: GetProfileInfoResponseResult.success,
                movies: userInfo.movies,
                buddies: userInfo.user.buddies,
                me: userInfo.user
            }
    }

    private calculateLikeability(rates: number[]): number {
        const sum = rates.reduce((a, b) => a + b, 0);
        const percent = (Math.sqrt(((sum / rates.length) + 4) * 12.5)) * 10;
        return percent;
    }
}
