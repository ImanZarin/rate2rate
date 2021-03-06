import { Controller, Get, Put, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { MovieService } from './movies.service';
import { IMovie } from './movie.model';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('movies')
export class MovieController {
    constructor(private readonly movieService: MovieService) { }

    @Get()
    async getAll(): Promise<IMovie[]> {
        return await this.movieService.getAll();
    }

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

}
