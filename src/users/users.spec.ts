import { IUser } from "./user.model";
import { UserService } from "./users.service";
import { Test, TestingModule } from "@nestjs/testing";
import { Model } from 'mongoose';
import { getModelToken } from "@nestjs/mongoose";
import { async } from "rxjs/internal/scheduler/async";

describe('users', () => {
    it('getAll', async () => {
        const execMock = jest.fn(() => {
            return Promise.resolve([]);
        });
        const app = await Test.createTestingModule({
            providers: [
                {
                    provide: getModelToken('User'),
                    useValue: {
                        find: () => ({
                            exec: execMock
                        })
                    },
                },
                UserService,
            ]
        }).compile();
        const uService = app.get(UserService);
        const r = await uService.getAll();
        expect(r).toHaveLength(0);
        expect(execMock).toHaveBeenCalledTimes(1);
    })

    it('create/repeted', async () => {
        const app = await Test.createTestingModule({
            providers: [
                {
                    provide: getModelToken('User'),
                    useValue: {
                        findOne: () => Promise.resolve({
                            "_id": "5eb10b521852d65394a418da",
                            "username": "srk",
                            "email": "",
                            "admin": false
                        }),
                    },
                },
                UserService,
            ]
        }).compile();
        const uService = app.get(UserService);
        const r = await uService.create('testname', 'test@etest.mail');
        expect(r).toBeNull;
    })

    // it('create/new', async () => {
    //     const app = await Test.createTestingModule({
    //         providers: [
    //             {
    //                 provide: getModelToken('User'),
    //                 useValue: jest.fn().mockImplementation((a1) => {
    //                     return Object.assign(a1, {
    //                         findOne: () => Promise.resolve({
    //                             "_id": "5eb10b521852d65394a418da",
    //                             "username": "srk",
    //                             "email": "",
    //                             "admin": false
    //                         }),
    //                         save: () => Promise.resolve({ id: "5eb10b521852d65394a418da" }),

    //                     });
    //                 }),
    //             },
    //             UserService,
    //         ]
    //     }).compile();
    //     const uService = app.get(UserService);
    //     const r = await uService.create('testname', 'test@etest.mail');
    //     expect(r).toBe("5eb10b521852d65394a418da");
    // })

  
    it('find', async () => {
        const app = await Test.createTestingModule({
            providers: [
                {
                    provide: getModelToken('User'),
                    useValue: {
                        findById: () => Promise.resolve({
                            "_id": "5eb10b521852d65394a418da",
                            "username": "srk",
                            "email": "",
                            "admin": false
                        })
                    },
                },
                UserService,
            ]
        }).compile();
        const uService = app.get(UserService);
        const r = await uService.find("5eb10b521852d65394a418da");
        expect(r._id).toBe("5eb10b521852d65394a418da");
    })

    it('searchN', async () => {
        const app = await Test.createTestingModule({
            providers: [
                {
                    provide: getModelToken('User'),
                    useValue: {
                        findOne: () => Promise.resolve({
                            "_id": "5eb10b521852d65394a418da",
                            "username": "srk",
                            "email": "",
                            "admin": false
                        })
                    },
                },
                UserService,
            ]
        }).compile();
        const mService = app.get(UserService);
        const r = await mService.searchName("srk");
        expect(r._id).toBe("5eb10b521852d65394a418da");
    })

    it('searchE', async () => {
        const app = await Test.createTestingModule({
            providers: [
                {
                    provide: getModelToken('User'),
                    useValue: {
                        findOne: () => Promise.resolve({
                            "_id": "5eb10b521852d65394a418da",
                            "username": "srk",
                            "email": "test@yahoo.com",
                            "admin": false
                        })
                    },
                },
                UserService,
            ]
        }).compile();
        const mService = app.get(UserService);
        const r = await mService.searchEmail("test@yahoo.com");
        expect(r._id).toBe("5eb10b521852d65394a418da");
    })

    it('delete', async () => {
        const app = await Test.createTestingModule({
            providers: [
                {
                    provide: getModelToken('User'),
                    useValue: {
                        deleteOne: () => Promise.resolve({
                            "n": 1,
                            "ok": 1,
                            "deletedCount": 0
                        })
                    },
                },
                UserService,
            ]
        }).compile();
        const mService = app.get(UserService);
        const r = await mService.delete("5eb10b521852d65394a418da");
        expect(r.n).toBe(1);
    })

    it('update', async () => {
        const app = await Test.createTestingModule({
            providers: [
                {
                    provide: getModelToken('User'),
                    useValue: {
                        findById: () => Promise.resolve({
                            _id: "5eb10b521852d65394a418da",
                            username: "srk",
                            email: "test@yahoo.com",
                            admin: false,
                            bodies: ["001", "002"],
                            save: () => { }
                        })
                    },
                },
                UserService,
            ]
        }).compile();
        const mService = app.get(UserService);
        const r = await mService.update("5eb10b521852d65394a418da", "003");
        expect(r.username).toBe("srk");
        expect(r.bodies).toEqual(["001", "002", "003"]);
        expect(r.bodies.length).toBe(3);
    })
})
