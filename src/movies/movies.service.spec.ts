import { MovieService } from "./movies.service";
import { Test } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";

describe('movies', () => {
    it('getAll', async () => {
        const execMock = jest.fn(() => {
            return Promise.resolve([]);
        });
        const app = await Test.createTestingModule({
            providers: [
                {
                    provide: getModelToken('Movie'),
                    useValue: {
                        find: () => ({
                            exec: execMock
                        })
                    },
                },
                MovieService,
            ]
        }).compile();
        const mService = app.get(MovieService);
        const r = await mService.getAll();
        expect(r).toHaveLength(0);
        expect(execMock).toHaveBeenCalledTimes(1);
    })

    it('create', async () => {
        const app = await Test.createTestingModule({
            providers: [
                {
                    provide: getModelToken('Movie'),
                    useValue: jest.fn().mockImplementation((a1) => {
                        return Object.assign(a1, {
                            save: () => Promise.resolve({ id: "5eb10b521852d65394a418da" }),
                        });
                    }),
                },
                MovieService,
            ]
        }).compile();
        const mService = app.get(MovieService);
        const r = await mService.create('', 1968, null, null, [], [], [], "", 0, new Date("28 Nov 2013").toUTCString());
        expect(r).toBe("5eb10b521852d65394a418da");
    })

    it('find', async () => {
        const app = await Test.createTestingModule({
            providers: [
                {
                    provide: getModelToken('Movie'),
                    useValue: {
                        findById: () => Promise.resolve({
                            "_id": "5eb10b521852d65394a418da",
                            "title": "kal ho na ho",
                            "year": "2009",
                            "cast": ["shahrukh khan", "prietty zinta", "saifali khan"],
                            "genre": ["comdedy", "drama"]
                        })
                    },
                },
                MovieService,
            ]
        }).compile();
        const mService = app.get(MovieService);
        const r = await mService.find(["5eb10b521852d65394a418da"])[0];
        expect(r._id).toBe("5eb10b521852d65394a418da");
    })

    it('search', async () => {
        const app = await Test.createTestingModule({
            providers: [
                {
                    provide: getModelToken('Movie'),
                    useValue: {
                        findOne: () => Promise.resolve({
                            "_id": "5eb10b521852d65394a418da",
                            "title": "kal ho na ho",
                            "year": "2009",
                            "cast": ["shahrukh khan", "prietty zinta", "saifali khan"],
                            "genre": ["comdedy", "drama"]
                        })
                    },
                },
                MovieService,
            ]
        }).compile();
        const mService = app.get(MovieService);
        const r = await mService.searchDBWithName("kal ho na ho", 2009);
        expect(r).toBe("5eb10b521852d65394a418da");
    })

    it('delete', async () => {
        const app = await Test.createTestingModule({
            providers: [
                {
                    provide: getModelToken('Movie'),
                    useValue: {
                        deleteOne: () => Promise.resolve({
                            "n": 1,
                            "ok": 1,
                            "deletedCount": 0
                        })
                    },
                },
                MovieService,
            ]
        }).compile();
        const mService = app.get(MovieService);
        const r = await mService.delete("5eb10b521852d65394a418da");
        expect(r.n).toBe(1);
    })

    it('update', async () => {
        const app = await Test.createTestingModule({
            providers: [
                {
                    provide: getModelToken('Movie'),
                    useValue: {
                        findById: () => Promise.resolve({
                            _id: "5eb10b521852d65394a418da",
                            title: "kal ho na ho",
                            year: "2009",
                            cast: ["shahrukh khan", "prietty zinta", "saifali khan"],
                            genre: ["comdedy", "drama"],
                            imageUrl: "",
                            save: () => { }
                        })
                    },
                },
                MovieService,
            ]
        }).compile();
        const mService = app.get(MovieService);
        const r = await mService.update(null, null, 1975, null, null, null, null);
        expect(r.year).toBe(1975);
        expect(r.brief).toBeUndefined;
        expect(r.title).toBe("kal ho na ho");
        console.log(r.cast);
        expect(r.cast).toEqual(["shahrukh khan", "prietty zinta", "saifali khan"]);
        expect(r.imageUrl).toBeNull;
    })
})
