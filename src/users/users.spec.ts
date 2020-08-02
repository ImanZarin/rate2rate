import { UserService } from "./users.service";
import { Test } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";

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
        const r = await uService.create('testname', 'test@etest.mail', 'testPass');
        expect(r).toBeNull;
    })

    it('create/new', async () => {
        let modelMock = jest.fn().mockImplementation(a => {
            return Object.assign(a ?? {}, {
                save: () => Promise.resolve({ id: "5eb10b521852d65394a418da" }),
            });
        });
        modelMock = Object.assign(modelMock, {
            findOne: () => null
        });
        const app = await Test.createTestingModule({
            providers: [
                {
                    provide: getModelToken('User'),
                    useValue: modelMock,
                },
                UserService,
            ]
        }).compile();
        const uService = app.get(UserService);
        const r = await uService.create('testname', 'test@etest.mail', 'testPass');
        expect(r).toBe("5eb10b521852d65394a418da");
    })


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
        const r = await uService.find(["5eb10b521852d65394a418da"])[0];
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

    it('updateCreateBuddy', async () => {
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
                            bodies: [{ buddyUserId: "001", rate: 1 }, { buddyUserId: "002", rate: 2 }],
                            save: () => { }
                        })
                    },
                },
                UserService,
            ]
        }).compile();
        const mService = app.get(UserService);
        const r = await mService.updateCreateBuddy("5eb10b521852d65394a418da", "003", 3);
        expect(r.user.username).toBe("srk");
        expect(r.user.buddies).toEqual([{ buddyUserId: "001", rate: 1 }, { buddyUserId: "002", rate: 2 }, { bodyUserId: "003", rate: 3 }]);
        expect(r.user.buddies.length).toBe(3);
    })
})
