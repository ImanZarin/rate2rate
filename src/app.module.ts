/* eslint-disable @typescript-eslint/no-var-requires */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieModule } from './movies/movies.module';
import { UserModule } from './users/users.module';
import { MovieUserModule } from './movieusers/movieuser.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
//import config from './config';

const config = require('./config');
//console.log("mongo is: ",config.mongoUrl);
const url = config.mongoUrl;

@Module({
  imports: [MongooseModule.forRoot(url),
  ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.local' }),
    MovieModule, UserModule, MovieUserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
