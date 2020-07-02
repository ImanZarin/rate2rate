import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { MovieUserSchema } from './movieusers.model';
import { MovieUserController } from "./movieusers.controller";
import { MovieUserService } from "./movieusers.service";
import { UserService } from "src/users/users.service";
import { MovieService } from "src/movies/movies.service";
import { UserSchema } from "src/users/user.model";
import { MovieSchema } from "src/movies/movie.model";


@Module({
    imports: [MongooseModule.forFeature([{ name: 'MovieUser', schema: MovieUserSchema },
    { name: 'User', schema: UserSchema }, { name: 'Movie', schema: MovieSchema }])],
    controllers: [MovieUserController],
    providers: [MovieUserService, UserService, MovieService],
})


export class MovieUserModule { };