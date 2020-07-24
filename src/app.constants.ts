export class Constants {
    static minMovieYear = 1970;
    static maxMovieYear = 2025;
    static minMovieRate = 1;
    static maxMovieRate = 5;
    static minBodyRate = 1;
    static maxBodyRate = 5;
    static whiteList: string[] =  ['http://localhost:3000', 'https://localhost:3000', 
    'http://localhost:3005', 'https://localhost:3005'];

    static jwtConstants = {
        secret: 'secretKey',
        expiringTime: 2592000000//time is a month in miliseconds
      };
}
