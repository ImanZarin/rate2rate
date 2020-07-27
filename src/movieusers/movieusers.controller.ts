import { Controller, Get, Put, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { MovieUserService } from './movieusers.service';
import { IMovieUser } from './movieusers.model';
import { GetUserInfoResponse, GetUserInfoForSignedResponse, GetMovieInfoResponse, GetMovieInfoForSignedResponse, UpdateMovieRateResponse, UpdateBodyResponse } from 'src/apiTypes';
import { JwtAuthOptionalGuard } from '../auth/jwt-auth-optional.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('movieusers')
export class MovieUserController {
    constructor(private readonly muService: MovieUserService) { }

    @Get()
    async getAll(): Promise<IMovieUser[]> {
        return await this.muService.getAll();
    }

    @UseGuards(JwtAuthOptionalGuard)
    @Get('user/:id')
    async getUserInfo(
        @Param('id') id: string,
        @Request() req): Promise<GetUserInfoForSignedResponse | GetUserInfoResponse> {
        if (req.user.username) {
            //TODO if id === user._id redirect to profile page
            return await this.muService.findForUserExtra(id, req.user.username);
        } else {
            return await this.muService.findForUser(id);
        }
    }

    @UseGuards(JwtAuthOptionalGuard)
    @Get('movie/:id')
    async getMovieInfo(
        @Param('id') id: string,
        @Request() req): Promise<GetMovieInfoForSignedResponse | GetMovieInfoResponse> {
        if (req.user.username) {
            return await this.muService.findForMovieExtra(id, req.user.username);
        } else {
            return await this.muService.findForMovie(id);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Put(':movieId')
    async updateAndcreate(
        @Request() req,
        @Body('rate') r: number,
        @Param('movieId') m: string,
    ): Promise<UpdateMovieRateResponse> {
        const iMovieUser: IMovieUser = await this.muService.search(req.user.userId, m);
        if (iMovieUser) {
            return await this.muService.update(iMovieUser._id, r);
        }
        else {
            return await this.muService.create(req.user.userId, r, m);
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<{ ok?: number; n?: number; } & { deletedCount?: number; }> {
        return await this.muService.delete(id);
    }

    @Delete()
    async deleteAll(): Promise<{ ok?: number; n?: number; } & { deletedCount?: number; }> {
        return await this.muService.deleteAll();
    }

}
