export class Constants {
  static minMovieYear = 1800;
  static maxMovieYear = 2025;
  static minMovieRate = 1;
  static maxMovieRate = 5;
  static minBodyRate = 1;
  static maxBodyRate = 5;
  static whiteList: string[] = ['http://localhost:3000', 'https://localhost:3000',
    'http://localhost:3005', 'https://localhost:3005', 'http://127.0.0.1:3000',
    'https://127.0.0.1:3000', 'http://127.0.0.1:3005', 'https://127.0.0.1:3005'];
  static jwtConstants = {
    secret: process.env.JWT_SECRET_KEY,
    expiringTime: 2592000000//time is a month in miliseconds
  };
}
