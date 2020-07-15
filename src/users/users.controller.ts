import { Controller, Get, Put, Body, Param, Delete } from '@nestjs/common';
import { UserService } from './users.service';
import { IUser } from './user.model';

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
    async delete(@Param('id') id: string): Promise<string> {
        return await this.userService.delete(id);
    }


    @Put(':id')
    async updateCreateBody(
        @Param('newBody') bodyId: string,
        @Body('username') u: string,
        @Body('rate') r: number,
    ): Promise<IUser> {
        return await this.userService.updateCreateBody(u, bodyId, r);
    }


}
