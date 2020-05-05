import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule} from '@nestjs/mongoose';
import { MovieModule } from './movies/movies.module';

var config = require('../config');

const url = config.mongoUrl;

@Module({
  imports: [MongooseModule.forRoot(url), MovieModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
