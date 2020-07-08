import { Controller, Get, Put, Body, Param, Delete, Post } from '@nestjs/common';
import { UserService } from './users.service';
import { IUser } from './user.model';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    async getAll(): Promise<IUser[]> {
        return await this.userService.getAll();
    }

    @Post('/signup')
    async create(
        @Body('username') u: string,
        @Body('email') e: string,
        @Body('password') p: string
    ) {
        const id: string = await this.userService.create(u, e, p);
        return id;
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
    async update(
        @Param('id') id: string,
        @Body('newBody') b: string,
    ): Promise<IUser> {
        return await this.userService.update(id, b);
    }

    
}
