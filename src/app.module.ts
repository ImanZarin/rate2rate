/* eslint-disable @typescript-eslint/no-var-requires */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieModule } from './movies/movies.module';
import { UserModule } from './users/users.module';
import { MovieUserModule } from './movieusers/movieuser.module';
import { AuthService } from './auth/auth.service';
import { UserService } from './users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';

const config = require('../config');

const url = config.mongoUrl;

@Module({
  imports: [MongooseModule.forRoot(url), MovieModule, UserModule, MovieUserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
