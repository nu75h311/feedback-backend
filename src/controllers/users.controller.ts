import * as express from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { logger } from '@shared';

import { IUser } from '@interfaces';
import { userModel as User } from '@models';

export class UsersController {

    getAllUsers = async (request: express.Request, response: express.Response): Promise<express.Response> => {
        try {
            const users: IUser[] = await User.find().exec();
            return response.status(OK).json({ users });
        } catch (err) {
            logger.error(err.message, err);
            return response.status(BAD_REQUEST).json({
                error: err.message,
            });
        }
    }

    createAUser = async (request: express.Request, response: express.Response): Promise<express.Response> => {
        const userData: IUser = request.body;
        const createdUser = new User(userData);
        const savedUser: IUser = await createdUser.save();
        return response.send(savedUser);
    }
}