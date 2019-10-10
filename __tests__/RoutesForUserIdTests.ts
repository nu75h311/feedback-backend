import request from 'supertest';
import { BAD_REQUEST, OK, NOT_FOUND } from 'http-status-codes';

import app from '@server';
import { logger } from '@shared';
import { User } from '@models';

import { MemoryDb } from './support/_setupDb';
import { Server } from 'http';

export const routesForUserIdTests = function () {
    // May require additional time for downloading MongoDB binaries
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

    let server: Server;
    const memoryDb: MemoryDb = new MemoryDb();

    beforeAll(async () => {
        memoryDb.initDb();

        const PORT = 3001;
        server = app.listen(PORT, () => {
            logger.debug(`Express server started on port: ${PORT}`);
        });
    });

    afterAll(async () => {
        server.close();
        await memoryDb.teardownDb();
    });

    beforeEach(async () => {
        // mongodb-memory-server requires this to handle unique keys
        await User.ensureIndexes();
    });

    afterEach(async () => {
        await memoryDb.cleanDb();
    });

    test('GET success', async () => {

        // given user in database
        const basicUser = {
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

    test('GET wrong id', async () => {

        // given user in database
        const basicUser = {
            name: 'Basic User',
            email: 'basic.user@gmail.com',
        };
        const createdUser = new User(basicUser);
        const savedUser = await createdUser.save();
        const userId = savedUser._id;

        // when GET all users
        const response = await request(app).get(`/api/users/${userId}somethingElse`);

        // then response should be BAD_REQUEST and error pointing out the wrong id
        expect(response.status).toBe(NOT_FOUND);
        expect(response.error.text).toMatch(/error: Cast to ObjectId failed for value (.*) at path "_id" for model "User"/);
    });

    test('PATCH success', async () => {

        // given user in database
        const basicUser = {
            name: 'Before Change User',
            email: 'before.change.user@gmail.com',
        };
        const createdUser = new User(basicUser);
        const savedUser = await createdUser.save();
        const userId = savedUser._id;

        // when PATCH that user
        const response = await request(app)
            .patch(`/api/users/${userId}`)
            .send({
                name: 'After Change User',
            });

        // then response should be OK and data should be updated
        expect(response.status).toBe(OK);
        expect(response.body.name).toBe('After Change User');
        expect(response.body.email).toBe('before.change.user@gmail.com');
    });

    test('PATCH using existing email', async () => {

        // given 2 users in database
        const firstUser = {
            name: 'First User',
            email: 'first.user@gmail.com',
        };
        const secondUser = {
            name: 'Second User',
            email: 'second.user@gmail.com',
        };
        const createdFirstUser = new User(firstUser);
        const createdSecondUser = new User(secondUser);
        await createdFirstUser.save();
        const savedUser = await createdSecondUser.save();
        const userId = savedUser._id;

        // when PATCH to change email to an existing user email
        const response = await request(app)
            .patch(`/api/users/${userId}`)
            .send({
                email: 'first.user@gmail.com',
            });

        // then response should be BAD_REQUEST and error pointing out the existing email
        expect(response.status).toBe(BAD_REQUEST);
        expect(response.error.text).toMatch(/error: E11000 duplicate key error dup key: { : "first.user@gmail.com" }/);
    });
}
