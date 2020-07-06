import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { MovieUserSchema } from './movieusers.model';
import { MovieUserController } from "./movieusers.controller";
import { MovieUserService } from "./movieusers.service";
import { MovieModule } from "src/movies/movies.module";
import { UserModule } from "src/users/users.module";


@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'MovieUser', schema: MovieUserSchema }]),
        MovieModule,
        UserModule
    ],
    controllers: [MovieUserController],
    providers: [MovieUserService],
})


export class MovieUserModule { };