import { Request, Response } from 'express';
import { BAD_REQUEST, CREATED, NOT_FOUND, OK } from 'http-status-codes';

import { logger } from '@shared';
import { IUser, User } from '@models';

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

    public getOne = async (req: Request, res: Response): Promise<Response> => {
        try {
            const user = await User.findById(req.params.userId);
            if (!user) {
                return res.status(NOT_FOUND).send(`User not found => id:${req.params.userId}`);
            };
            res.status(OK);
            return res.send(user);
        } catch (err) {
            logger.error(err.message, err);
            res.status(BAD_REQUEST);
            return res.send(`error: ${err.message}`);
        }
    };

    public updateOne = async (req: Request, res: Response): Promise<Response> => {
        try {
            const user = await User.findByIdAndUpdate(
                req.params.userId,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );
            if (!user) {
                return res.status(NOT_FOUND).send(`User not found => id:${req.params.userId}`);
            };
            res.status(OK);
            return res.send(user);
        } catch (err) {
            logger.error(err.message, err);
            res.status(BAD_REQUEST);
            return res.send(`error: ${err.message}`);
        }
    };

    public deleteOne = async (req: Request, res: Response): Promise<Response> => {
        try {
            const user = await User.findByIdAndDelete(req.params.userId);
            if (!user) {
                return res.status(NOT_FOUND).send(`User not found => id:${req.params.userId}`);
            };
            res.status(OK);
            return res.send(user);
        } catch (err) {
            logger.error(err.message, err);
            res.status(NOT_FOUND);
            return res.send(`error: ${err.message}`);
        }
    };
}
