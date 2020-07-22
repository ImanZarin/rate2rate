import { Controller, Get, Put, Body, Param, Delete, UseGuards, Request, Post } from '@nestjs/common';
import { UserService } from './users.service';
import { IUser } from './user.model';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    async getAll(): Promise<IUser[]> {
        return await this.userService.getAll();
    }

    // @Put()
    // async search(
    //     @Body('username') f: string,
    //     @Body('lastname') l: string
    // ): Promise<string> {
    //     let id: string = await this.userService.search(f, l);
    //     if (id)
    //         return id;
    // }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<{ ok?: number; n?: number; } & { deletedCount?: number; }> {
        return await this.userService.delete(id);
    }

    @Delete(':id/bodies')
    async deleteBodies(@Param('id') id: string): Promise<IUser> {
        return await this.userService.deleteBodies(id);
    }


    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updateCreateBody(
        @Request() req,
        @Param('id') bodyId: string,
        @Body('rate') r: number,
    ): Promise<IUser> {
        return await this.userService.updateCreateBody(req.user.userId, bodyId, r);
    }


}
