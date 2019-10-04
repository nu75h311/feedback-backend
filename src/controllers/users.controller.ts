import { Request, Response } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { logger } from '@shared';

import { IUser } from '@interfaces';
import { userModel as User } from '@models';

export class UsersController {

    public getAllUsers = async (request: Request, response: Response): Promise<Response> => {
        try {
            const users: IUser[] = await User.find().exec();
            response.status(OK);
            return response.send(users);
        } catch (err) {
            logger.error(err.message, err);
            response.status(BAD_REQUEST);
            return response.send(`error: ${err.message}`);
        }
    }

    public createAUser = async (request: Request, response: Response): Promise<Response> => {
        const userData: IUser = request.body;
        const createdUser = new User(userData);
        const savedUser: IUser = await createdUser.save();
        return response.send(savedUser);
    }
}
