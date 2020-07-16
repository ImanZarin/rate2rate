import { Controller, Get, Put, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { MovieUserService } from './movieusers.service';
import { IMovieUser } from './movieusers.model';
import { GetUserInfoResponse, GetUserInfoForSignedResponse } from 'src/apiTypes';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtAuthOptionalGuard } from '../auth/jwt-auth-optional.guard';

@Controller('movieusers')
export class MovieUserController {
    constructor(private readonly muService: MovieUserService) { }

    @Get()
    async getAll(): Promise<IMovieUser[]> {
        console.log("finally got to get all");
        return null;
        return await this.muService.getAll();
    }

    @Get(':id')
    async getInfo(@Param('id') id: string): Promise<GetUserInfoResponse> {
        return await this.muService.findForUser(id);
    }

    @UseGuards(JwtAuthOptionalGuard)
    @Get(':id')
    async getExtraInfo(
        @Param(":id") id: string,
        @Request() req): Promise<GetUserInfoForSignedResponse> {
        console.log("finally got here 2");
        return await this.muService.findForUserExtra(id, req.user._doc.username);
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
