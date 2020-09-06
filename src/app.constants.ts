export class Constants {
  static minMovieYear = 1800;
  static maxMovieYear = 2025;
  static minMovieRate = 1;
  static maxMovieRate = 5;
  static minBodyRate = 1;
  static maxBodyRate = 5;
  static whiteList: string[] = ['http://localhost:3000', 'https://localhost:3000',
    'http://localhost:3005', 'https://localhost:3005', 'http://dockerhost:3000',
    'https://dockerhost:3000', 'http://dockerhost:3005', 'https://dockerhost:3005'];
  static jwtConstants = {
    secret: process.env.JWT_SECRET_KEY,
    expiringTime: 2592000000//time is a month in miliseconds
  };
}
