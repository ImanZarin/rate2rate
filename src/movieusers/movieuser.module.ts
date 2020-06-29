import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { MovieUserSchema } from './movieusers.model';
import { MovieUserController } from "./movieusers.controller";
import { MovieUserService } from "./movieusers.service";


@Module({
    imports: [MongooseModule.forFeature([{ name: 'MovieUser', schema: MovieUserSchema }])],
    controllers: [MovieUserController],
    providers: [MovieUserService],
})


export class MovieUserModule { };