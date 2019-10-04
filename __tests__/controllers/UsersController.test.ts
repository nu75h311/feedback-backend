import { UsersController } from '@controllers';
import { IUser } from '@interfaces';
import { MemoryDb } from '../_setupDb';

// May require additional time for downloading MongoDB binaries
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

const memoryDb: MemoryDb = new MemoryDb();

beforeAll(async () => {
    memoryDb.initDb();
});

afterAll(async () => {
    await memoryDb.teardownDb();
});

describe('The UsersController', () => {
    const usersController = new UsersController();
    describe('when fetching with getAll()', () => {
        const expectedUsers: IUser[] = [
            {
                "name": "Basic Nser",
                "email": "basic.user@gmail.com",
            },
        ];
        it('should return all users', async () => {
            const response = usersController.getAllUsers;
            console.log(response);
            expect(Promise.resolve(usersController.getAllUsers)).toEqual(Promise.resolve(expectedUsers));
        });
    });
});