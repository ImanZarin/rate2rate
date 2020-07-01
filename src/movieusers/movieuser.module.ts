import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { MovieUserSchema } from './movieusers.model';
import { MovieUserController } from "./movieusers.controller";
import { MovieUserService } from "./movieusers.service";
import { MovieSchema } from "src/movies/movie.model";
import { UserService } from "src/users/users.service";


@Module({
    imports: [MongooseModule.forFeature([{ name: 'MovieUser', schema: MovieUserSchema },
    { name: 'Movie', schema: MovieSchema }])],
    controllers: [MovieUserController],
    providers: [MovieUserService, UserService],
})


export class MovieUserModule { };