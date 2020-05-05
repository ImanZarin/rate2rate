import { Module } from "@nestjs/common";
import { MongooseModule} from '@nestjs/mongoose';
import { MovieSchema } from './movie.model';
import { MovieController } from "./movies.controller";
import { MovieService } from "./movies.service";


@Module({
    imports: [MongooseModule.forFeature([{name: 'Movie', schema: MovieSchema}])],
    controllers: [MovieController],
    providers: [MovieService],
  })
  

export class MovieModule {};