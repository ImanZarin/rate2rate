import { Test } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { MovieUserService } from "./movieusers.service";
import { MovieService } from "../movies/movies.service";


describe('movie-user', () => {
    it('getAll', async () => {
        const execMock = jest.fn(() => {
            return Promise.resolve([]);
        });
        const app = await Test.createTestingModule({
            providers: [
                {
                    provide: getModelToken('MovieUser'),
                    useValue: {find: () => ({exec: execMock})},
                },
                {
                    provide: getModelToken('Movie'),
                    useValue: {find: () => ({exec: execMock})}
                },
                MovieService,
                MovieUserService,
            ]
        }).compile();
        const mService = app.get(MovieUserService);
        const r = await mService.getAll();
        expect(r).toHaveLength(0);
        expect(execMock).toHaveBeenCalledTimes(1);
    });

    it('create', async () => {
        const app = await Test.createTestingModule({
            providers: [
                {
                    provide: getModelToken('MovieUser'),
                    useValue: jest.fn().mockImplementation((a1) => {
                        return Object.assign(a1, {
                            save: () => Promise.resolve({
                                _id: "5eb10b521852d65394a418da",
                                movieId: "",
                                userId: "",
                                rate: 4
                            }),
                        });
                    }),
                },
                {
                    provide: getModelToken('Movie'),
                    useValue: {}
                },
                MovieService,
                MovieUserService,
            ]
        }).compile();
        const muService = app.get(MovieUserService);
        const r = await muService.create('5ed666e4cc8ec8697817e314', 4, '5eb466360884d346a82b58e5');
        expect(r._id).toBe("5eb10b521852d65394a418da");
    });

    it('find', async () => {
        const app = await Test.createTestingModule({
            providers: [
                {
                    provide: getModelToken('MovieUser'),
                    useValue: {
                        findById: () => Promise.resolve({
                            "_id": "5ef731897807c812b8572853",
                            "userId": "5ed666e4cc8ec8697817e314",
                            "movieId": "5eb466360884d346a82b58e5",
                            "rate": 5
                        })
                    },
                },
                {
                    provide: getModelToken('Movie'),
                    useValue: {find: () => ({})}
                },
                MovieService,
                MovieUserService,
            ]
        }).compile();
        const mService = app.get(MovieUserService);
        const r = await mService.find("5ef731897807c812b8572853");
        expect(r._id).toBe("5ef731897807c812b8572853");
    });

    // it('find4User', async () => {
    //     const app = await Test.createTestingModule({
    //         providers: [
    //             {
    //                 provide: getModelToken('MovieUser'),
    //                 useValue: {
    //                     find: () => Promise.resolve([{
    //                         "_id": "5ef731897807c812b8572853",
    //                         "userId": "5ed666e4cc8ec8697817e314",
    //                         "movieId": "5eb466360884d346a82b58e5",
    //                         "rate": 5
    //                     },
    //                     {
    //                         "_id": "5ef731897807c812b8572854",
    //                         "userId": "5ed666e4cc8ec8697817e314",
    //                         "movieId": "5eb466360884d346a82b58e6",
    //                         "rate": 3
    //                     }])
    //                 },
    //             },
    //             MovieUserService,
    //         ]
    //     }).compile();
    //     const muService = app.get(MovieUserService);
    //     const r = await muService.findForUser("5ed666e4cc8ec8697817e314");
    //     for (const m of r) {
    //         expect(m).toBe("5eb466360884d346a82b58e5");
    //     }
    // });

    it('findAllMovies', async () => {
        const app = await Test.createTestingModule({
            providers: [
                {
                    provide: getModelToken('Movie'),
                    useValue: {
                        findById: () => Promise.resolve({
                            "title": "kal ho na ho",
                            "brief": "aman is the angel coming to kapoor family to ligth up their miserable life, but...",
                            "genre": [
                                "comdedy",
                                "drama"
                            ],
                            "cast": [
                                "shahrukh khan",
                                "prietty zinta",
                                "saifali khan"
                            ],
                            "_id": "5eb466360884d346a82b58e5",
                            "year": 2011
                        })
                    },
                },
                {
                    provide: getModelToken('MovieUser'),
                    useValue: {find: () => ({})}
                },
                MovieService,
                MovieUserService,
            ]
        }).compile();
        const muService = app.get(MovieUserService);
        const movieUsersData = [{
            "_id": "5ef731897807c812b8572853",
            "userId": "5ed666e4cc8ec8697817e314",
            "movieId": "5eb466360884d346a82b58e5",
            "rate": 5
        }, {
            "_id": "5ef731897807c812b8572854",
            "userId": "5ed666e4cc8ec8697817e314",
            "movieId": "5eb466360884d346a82b58e6",
            "rate": 3
        }];
        const r = await muService.findAllMovies(movieUsersData);
        expect(r.length).toBe(2);
        expect(r[0]._id).toBe("5eb466360884d346a82b58e5");
    });

});