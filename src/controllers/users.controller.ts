import { Request, Response } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { logger } from '@shared';

import { IUser } from '@interfaces';
import { userModel as User } from '@models';

export class UsersController {

    public getAllUsers = async (req: Request, res: Response): Promise<Response> => {
        try {
            const users: IUser[] = await User.find().exec();
            res.status(OK);
            return res.send(users);
        } catch (err) {
            logger.error(err.message, err);
            res.status(BAD_REQUEST);
            return res.send(`error: ${err.message}`);
        }
    }

    public createUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const userData: IUser = req.body;
            const createdUser = new User(userData);
            const savedUser: IUser = await createdUser.save();
            res.status(CREATED);
            return res.send(savedUser);
        } catch (err) {
            logger.error(err.message, err);
            res.status(BAD_REQUEST);
            return res.send(`error: ${err.message}`);
        }
    }
}
