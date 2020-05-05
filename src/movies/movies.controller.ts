import { Controller, Get } from '@nestjs/common';
import { MovieService } from './movies.service';
import { IMovie } from './movie.model';

@Controller()
export class MovieController {
    constructor(private readonly movieService: MovieService) { }

    @Get()
    async getAll(): Promise<IMovie[]> {
        return await this.movieService.getAll();
    }
}
