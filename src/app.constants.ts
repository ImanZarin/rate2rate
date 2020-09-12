export class Constants {
  static minMovieYear = 1800;
  static maxMovieYear = 2025;
  static minMovieRate = 1;
  static maxMovieRate = 5;
  static minBodyRate = 1;
  static maxBodyRate = 5;
  static jwtConstants = {
    secret: process.env.JWT_SECRET_KEY,
    expiringTime: 2592000000//time is a month in miliseconds
  };
}
