import { Controller, Get, Put, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UserService } from './users.service';
import { IUser } from './user.model';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateBuddyResponse } from 'src/apiTypes';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    async getAll(): Promise<IUser[]> {
        return await this.userService.getAll();
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<{ ok?: number; n?: number; } & { deletedCount?: number; }> {
        return await this.userService.delete(id);
    }

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
