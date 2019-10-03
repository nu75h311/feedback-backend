import mockingoose from 'mockingoose';

import { UsersController } from '@controllers';
import { IUser } from '@interfaces';
import { userModel as User } from '@models';

describe('The UserController', () => {
    const userController = new UsersController();
    describe('when fetching with getAll()', () => {
        const expectedUsers: IUser[] = [
            {
                "name": "First User",
                "email": "first.user@gmail.com",
            },
        ];
        mockingoose(User).toReturn(expectedUsers, 'find');
        test('should return all users', () => {
            expect(userController.getAllUsers).toEqual(expectedUsers);
        });
    });
});