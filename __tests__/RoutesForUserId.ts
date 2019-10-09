import request from 'supertest';
import { BAD_REQUEST, OK } from 'http-status-codes';

import app from '@server';
import { logger } from '@shared';

import { userModel as User } from '@models';
import { IUser } from '@interfaces';
import { MemoryDb } from './support/_setupDb';
import { Server } from 'http';

export const routesForUserIdTests = function () {
    // May require additional time for downloading MongoDB binaries
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

    let server: Server;
    const memoryDb: MemoryDb = new MemoryDb();

    beforeAll(async () => {
        memoryDb.initDb();

        const PORT = Number(3001);
        server = app.listen(PORT, () => {
            logger.debug(`Express server started on port: ${PORT}`);
        });
    });

    afterAll(async () => {
        server.close();
        await memoryDb.teardownDb();
    });

    afterEach(async () => {
        await memoryDb.cleanDb();
    });

    test('GET success', async () => {

        // given user in database
        const basicUser: IUser = {
            name: 'Basic User',
            email: 'basic.user@gmail.com',
        };
        const createdUser = new User(basicUser);
        const savedUser = await createdUser.save();
        const userId = savedUser._id;

        // when GET all users
        const response = await request(app).get(`/api/users/${userId}`);

        // then response should be OK and data should be correct
        expect(response.status).toBe(OK);
        expect(response.body.name).toBe(basicUser.name);
        expect(response.body.email).toBe(basicUser.email);
    });

    // test('PATCH', async () => {

    //     // given user in database
    //     const basicUser: IUser = {
    //         name: 'Before Change User',
    //         email: 'before.change.user@gmail.com',
    //     };
    //     const createdUser = new User(basicUser);
    //     await createdUser.save();

    //     // when PATCH that user
    //     const response = await request(app)
    //         .patch('/api/users');

    //     // then response should be OK and data should be correct
    //     expect(response.status).toBe(OK);
    //     expect(response.body[0]._id).toBeDefined;
    //     expect(response.body[0].name).toBe(basicUser.name);
    //     expect(response.body[0].email).toBe(basicUser.email);
    // });
}
