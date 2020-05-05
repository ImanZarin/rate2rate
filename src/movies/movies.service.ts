import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IMovie } from './movie.model';
import { Model } from 'mongoose';

@Injectable()
export class MovieService {
    private Movies: IMovie[] = [];

    constructor(@InjectModel('Movie') private readonly movieModel: Model<IMovie>) {

    }

    async getAll(): Promise<IMovie[]> {
        const result = await this.movieModel.find().exec();
        return result;
    }

    async create(title: string, yr: number, brief: string, imgUrl: string, genre: string[], cast: string[]): Promise<string> {
        const newMovie = new this.movieModel({
            title: title,
            year: yr,
            breif: brief,
            imageUrl: imgUrl,
            genre: genre,
            cast: cast
        });
        const result = await newMovie.save();
        return result.id as string;
    }

    async find(id: string): Promise<IMovie> {
        const result = await this.movieModel.findById(id);
        return result;
    }

    async search(title: string, yr: number): Promise<string> {
        const result = await this.movieModel.find({ title: title, year: yr });
        return result.id as string;
    }

    async delete(id: string) {
        const result = await this.movieModel.delete({ _id: id });
        return result;
    }

    async update(id: string, title: string, yr: number, brief: string, imgUrl: string, genre: string[], cast: string[])
        : Promise<IMovie> {
        const updated = await this.movieModel.findById(id);
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
        updated.save();
        return updated;
    }
}
