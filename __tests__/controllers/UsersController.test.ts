import { UsersController } from '@controllers';
import { IUser } from '@interfaces';

describe('The UserController', () => {
    const userController = new UsersController();
    describe('when fetching with getAll()', () => {
        const expectedUsers: IUser[] = [
            {
                "name": "First User",
                "email": "first.user@gmail.com",
                "id": "defined_Id"
            },
        ];
        test('should return all users', () => {
            expect(userController.getAllUsers).toEqual(Promise.resolve(expectedUsers));
        });
    });
});