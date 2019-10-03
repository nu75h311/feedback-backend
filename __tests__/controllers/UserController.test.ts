import { UserController } from '../../src/controllers/User/UserController.mock';
import { IUser } from '@entities';

describe('The UserController', () => {
    const userController = new UserController();
    describe('when fetching with getAll()', () => {
        const expectedUsers: IUser[] = [
            {
                "name": "Sean Maxwell",
                "email": "sean.maxwell@gmail.com",
                "id": 159123164363
            },
            {
                "name": "Gordan Freeman",
                "email": "gordan.freeman@halflife.com",
                "id": 906524522143
            },
            {
                "name": "John Smith",
                "email": "jsmith@yahoo.com",
                "id": 357437875835
            }
        ];
        test('should return all users', () => {
            expect(userController.getAll()).toEqual(Promise.resolve(expectedUsers));
        });
    });
});