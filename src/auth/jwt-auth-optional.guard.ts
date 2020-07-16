import { AuthGuard } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtAuthOptionalGuard extends AuthGuard(['jwt', 'anonymous']) { }