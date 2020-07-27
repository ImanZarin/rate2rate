import { Controller, Get, Put, Body, Param, Delete, UseGuards, Post } from '@nestjs/common';
import { MovieService } from './movies.service';
import { IMovie, IMDBsearch } from './movie.model';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SearchMovieResponse } from 'src/apiTypes';

@Controller('movies')
export class MovieController {
    constructor(private readonly movieService: MovieService) { }

    @Get()
    async getAll(): Promise<IMovie[]> {
        return await this.movieService.getAll();
    }

    // @Put()
    // async searchAndcreate(
    //     @Body('title') t: string,
    //     @Body('year') y: number,
    //     @Body('brief') b: string,
    //     @Body('cast') c: string[],
    //     @Body('genre') g: string[],
    //     @Body('imageUrl') i: string
    // ): Promise<string> {
    //     const id: string = await this.movieService.searchDBWithName(t, y);
    //     if (id)
    //         return id;
    //     else
    //         return await this.movieService.create(t, y, b, i, g, c);
    // }

    @Put()
    async searchAndcreate(
        @Body('imdbId') i: string
    ): Promise<string> {
        const id: string = await this.movieService.searchDBWithImdb(i);
        if (id)
            return id;
        else
            return await this.movieService.createFromImdb(i);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<{ ok?: number; n?: number; } & { deletedCount?: number; }> {
        return await this.movieService.delete(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body('title') t: string,
        @Body('year') y: number,
        @Body('brief') b: string,
        @Body('cast') c: string[],
        @Body('genre') g: string[],
        @Body('imageUrl') i: string): Promise<IMovie> {
        return await this.movieService.update(id, t, y, b, i, g, c);
    }

    @Post()
    async search(
        @Body('movie') movie: string
    ): Promise<SearchMovieResponse> {

        return await this.movieService.searchEverywhere(movie);
    }
}
