import { Controller, Get, Put, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UserService } from './users.service';
import { IUser } from './user.model';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateBuddyResponse } from 'src/shared/apiTypes';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    //TODO admin guard
    @Get()
    async getAll(): Promise<IUser[]> {
        return await this.userService.getAll();
    }

    //TODO admin guard
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<{ ok?: number; n?: number; } & { deletedCount?: number; }> {
        return await this.userService.delete(id);
    }

    //TODO admin guard
    @Delete(':id/buddies')
    async deleteBodies(@Param('id') id: string): Promise<IUser> {
        return await this.userService.deleteBuddies(id);
    }


    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updateCreateBuddy(
        @Request() req,
        @Param('id') buddyId: string,
        @Body('rate') r: number,
    ): Promise<UpdateBuddyResponse> {
        return await this.userService.updateCreateBuddy(req.user.userId, buddyId, r);
    }


}
