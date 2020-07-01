export interface FindForUserResponse {
    user: {
        _id: string;
        name: string;
    },
    movies: MovieRate[],
}

export interface MovieRate {
    _id: string;
    title: string;
    year: number;
    rate: number;

}