import { Injectable, HttpService } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IMovie, IMDBsearch, IMDBmovie } from './movie.model';
import { Model } from 'mongoose';
import { SearchResponse } from 'src/shared/apiTypes';
import { SearchResponseResult } from 'src/shared/result.enums';
//import { Observable } from 'rxjs/internal/Observable';
//import 'rxjs/add/operator/toPromise';
//import { AxiosResponse } from '@nestjs/common/http/interfaces/axios.interfaces';

@Injectable()
export class MovieService {

    constructor(@InjectModel('Movie') private readonly movieModel: Model<IMovie>,
        private readonly httpService: HttpService) {

    }

    async getAll(): Promise<IMovie[]> {
        const result = await this.movieModel.find().exec();
        return result;
    }

    async create(title: string, yr: number, brief: string, imgUrl: string, genre: string[], cast: string[],
        directors: string[], imdbId: string): Promise<IMovie> {
        const newMovie = new this.movieModel({
            title: title,
            year: yr,
            brief: brief,
            imageUrl: imgUrl,
            genre: genre,
            cast: cast,
            director: directors,
            imdbId: imdbId,
            insertDate: (new Date()).toISOString()
        });
        const result = await newMovie.save();
        return result;
    }

    async createFromImdb(imdbId: string): Promise<string> {
        const imdbMovie = await this.findFromIMDB(imdbId);
        if (imdbMovie) {
            const result = await this.create(imdbMovie.Title, imdbMovie.Year, imdbMovie.Plot,
                imdbMovie.Poster, imdbMovie.Genre.split(","), imdbMovie.Actors.split(","),
                imdbMovie.Director.split(","), imdbMovie.imdbID);
            return result._id as string;
        }
        else
            return null;
    }

    async find(ids: string[]): Promise<IMovie[]> {
        const result = await this.movieModel.find({ _id: { $in: ids } });
        return result;
    }

    async findMovies(ids: string[]): Promise<IMovie[]> {
        const result = await this.movieModel.find({ _id: { $in: ids } });
        return result;
    }

    async searchDBWithName(title: string, yr: number): Promise<string> {
        const result = await this.movieModel.findOne({ title: title, year: yr });
        if (result)
            return result._id as string;
        else
            return null;
    }

    async searchDBWithImdb(imdbId: string): Promise<string> {
        const result = await this.movieModel.findOne({ imdbId: imdbId });
        if (result)
            return result._id as string;
        else
            return null;
    }

    async searchEverywhere(text: string): Promise<SearchResponse> {
        const mHeader = {
            'x-rapidapi-key': 'c521c136efmsh63f66c3f0814b1dp107323jsnc695b43ec769',
            'x-rapidapi-host': 'movie-database-imdb-alternative.p.rapidapi.com',
            'useQueryString': 'true'
        };
        const url = 'https://movie-database-imdb-alternative.p.rapidapi.com/';
        const mParams = { page: 1, r: "json", type: "movie", s: text };
        return await this.httpService.get(url, { params: mParams, headers: mHeader }).toPromise()
            .then((resp) => {
                if (!resp)
                    return {
                        result: SearchResponseResult.failed,
                        movies: [],
                        users: []
                    }
                const { data } = resp;
                if ((data.Search as IMDBsearch[])?.length > 0)
                    return {
                        result: SearchResponseResult.success,
                        movies: data.Search,
                        users: []
                    };
                else
                    return {
                        result: SearchResponseResult.noMovie,
                        movies: [],
                        users: []
                    }
            })
            .catch(err => {
                console.log("err is: ", err);
                return {
                    result: SearchResponseResult.failed,
                    movies: [],
                    users: []
                }
            })
    }

    async delete(id: string) {
        const result = await this.movieModel.deleteOne({ _id: id });
        return result;
    }

    async update(id: string, title: string, yr: number, brief: string, imgUrl: string, genre: string[], cast: string[])
        : Promise<IMovie> {
        const updated: IMovie = await this.movieModel.findById(id);
        if (title)
            updated.title = title;
        if (yr)
            updated.year = yr;
        if (brief)
            updated.brief = brief;
        if (imgUrl)
            updated.imageUrl = imgUrl;
        if (genre)
            updated.genre = genre;
        if (cast)
            updated.cast = cast;
        updated.updateDate = (new Date()).toISOString();
        updated.save();
        return updated as IMovie;
    }

    async findFromIMDB(id: string): Promise<IMDBmovie> {
        const mHeader = {
            'x-rapidapi-key': 'c521c136efmsh63f66c3f0814b1dp107323jsnc695b43ec769',
            'x-rapidapi-host': 'movie-database-imdb-alternative.p.rapidapi.com',
            'useQueryString': 'true'
        };
        const url = 'https://movie-database-imdb-alternative.p.rapidapi.com/';
        const mParams = { i: id, r: "json" };
        return await this.httpService.get(url, { params: mParams, headers: mHeader }).toPromise()
            .then((resp) => {
                if (!resp)
                    return null;
                else {
                    const { data } = resp;
                    return data;
                }
            })
            .catch(err => {
                console.log("err is: ", err);
                return null;
            })
    }
}
