import { Controller, Get, Put, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { MovieUserService } from './movieusers.service';
import { IMovieUser } from './movieusers.model';
import { GetUserInfoResponse, GetUserInfoForSignedResponse } from 'src/apiTypes';
import { JwtAuthOptionalGuard } from '../auth/jwt-auth-optional.guard';

@Controller('movieusers')
export class MovieUserController {
    constructor(private readonly muService: MovieUserService) { }

    @Get()
    async getAll(): Promise<IMovieUser[]> {
        return await this.muService.getAll();
    }

    @UseGuards(JwtAuthOptionalGuard)
    @Get(':id')
    async getInfo(
        @Param('id') id: string,
        @Request() req): Promise<GetUserInfoForSignedResponse | GetUserInfoResponse> {
        if (req.user.username) {
            //TODO if id === user._id redirect to profile page
            return await this.muService.findForUserExtra(id, req.user.username);
        } else {
            return await this.muService.findForUser(id);
        }
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

    @Delete()
    async deleteAll(): Promise<IMovieUser[]> {
        return await this.muService.deleteAll();
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body('r') r: number,)
        : Promise<IMovieUser> {
        return await this.muService.update(id, r);

    }
}
