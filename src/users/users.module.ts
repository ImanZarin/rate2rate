import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.model';
import { UserController } from "./users.controller";
import { UserService } from "./users.service";
import { AuthModule } from "src/auth/auth.module";


@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  //forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})


export class UserModule { };