import { Module, HttpModule } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { MovieSchema } from './movie.model';
import { MovieController } from "./movies.controller";
import { MovieService } from "./movies.service";


@Module({
  imports: [MongooseModule.forFeature([{ name: 'Movie', schema: MovieSchema }]), HttpModule],
  controllers: [MovieController],
  providers: [MovieService],
  exports: [MovieService]
})


export class MovieModule { };