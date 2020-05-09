import { Controller, Get, Put, Body, Param, Delete } from '@nestjs/common';
import { UserService } from './users.service';
import { IUser } from './user.model';
import { strict } from 'assert';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    async getAll(): Promise<IUser[]> {
        return await this.userService.getAll();
    }

    @Put('/signup')
    async create(
        @Body('firstname') f: string,
        @Body('lastname') l: string
    ) {
        let id: string = await this.userService.create(f, l);
        return id;
    }

    @Put()
    async search(
        @Body('firstname') f: string,
        @Body('lastname') l: string
    ): Promise<string> {
        let id: string = await this.userService.search(f, l);
        if (id)
            return id;
    }

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
