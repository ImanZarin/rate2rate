
export type MovieRate = {
    movieTitle: string;
    movieId: string;
    rate: number;
    rateDate: string;
    userName: string;
    userId: string;
}

export type UserRate = {
    userId: string;
    userName: string;
    buddyId: string;
    buddyName: string;
    rate: number;
    rateDate: string;
}

export type Movie = {
    title: string;
    year: number;
    genre: string[];
    director: string[];
    actors: string[];
    plot: string;
    poster: string;
}

export type User = {
    id: string,
    username: string;
    email: string;
    buddies: UserRate[];
}

export type MovieSuggest = {
    movieId: string;
    movieTitle: string;
    rates: number[];
    likeability: number;
}