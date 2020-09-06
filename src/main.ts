/* eslint-disable @typescript-eslint/no-var-requires */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

//const config = require('./config');
//const port = config.port;
const cors = require('./cors');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors.corsWithOption);
  const configService = app.get(ConfigService);
  await app.listen(configService.get("BACKEND_PORT"));
}
bootstrap();
