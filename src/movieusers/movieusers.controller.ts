import { Controller, Get, Put, Body, Param, Delete } from '@nestjs/common';
import { MovieUserService } from './movieusers.service';
import { IMovieUser } from './movieusers.model';
import { IMovie } from 'src/movies/movie.model';

@Controller('movieusers')
export class MovieUserController {
    constructor(private readonly muService: MovieUserService) { }

    @Get()
    async getAll(): Promise<IMovieUser[]> {
        return await this.muService.getAll();
    }

    @Get(':id')
    async getMovies(@Param('id') id: string): Promise<IMovie[]> {
        return await this.muService.findForUser(id);
    }

    @Put()
    async updateAndcreate(
        @Body('userId') u: string,
        @Body('rate') r: number,
        @Body('movieId') m: string,
    ): Promise<IMovieUser> {
        const id: string = await this.muService.search(u, m);
        if (id) {
            return await this.muService.update(id, r);
        }
        else {
            return await this.muService.create(u, r, m);
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<string> {
        return await this.muService.delete(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body('r') r: number,)
        : Promise<IMovieUser> {
        return await this.muService.update(id, r);

    }
}
