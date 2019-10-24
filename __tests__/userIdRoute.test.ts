import request from 'supertest';
import { BAD_REQUEST, OK, NOT_FOUND } from 'http-status-codes';

import app from '@server';
import { logger } from '@shared';
import { User } from '@models';

import { MemoryDb } from './support/_setupDb';
import { Server } from 'http';

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

describe('/api/users/:userId', () => {
    describe('GET', () => {
        test('GET success', async () => {

            // given user in database
            const basicUser = {
                name: 'Basic User',
                email: 'basic.user@gmail.com',
            };
            const createdUser = new User(basicUser);
            const savedUser = await createdUser.save();
            const userId = savedUser._id;

            // when GET one user
            const response = await request(app).get(`/api/users/${userId}`);

            // then response should be OK and data should be correct
            expect(response.status).toBe(OK);
            expect(response.body.name).toBe(basicUser.name);
            expect(response.body.email).toBe(basicUser.email);
        });

        test('GET non existent user', async () => {

            // when GET one user with wrong id
            const response = await request(app).get(`/api/users/5d9f4fb63b42f22d7081125d`);

            // then response should be NOT_FOUND and error pointing out the wrong id
            expect(response.status).toBe(NOT_FOUND);
            expect(response.error.text).toBe('User not found => id:5d9f4fb63b42f22d7081125d');
        });
    });
    describe('PATCH', () => {

        test('PATCH success: change name', async () => {

            // given user in database
            const basicUser = {
                name: 'Before Change User',
                email: 'before.change.user@gmail.com',
            };
            const createdUser = new User(basicUser);
            const savedUser = await createdUser.save();
            const userId = savedUser._id;

            // when PATCH that user name
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

        test('PATCH success: change email', async () => {

            // given user in database
            const basicUser = {
                name: 'Before Change User',
                email: 'before.change.user@gmail.com',
            };
            const createdUser = new User(basicUser);
            const savedUser = await createdUser.save();
            const userId = savedUser._id;

            // when PATCH that user email
            const response = await request(app)
                .patch(`/api/users/${userId}`)
                .send({
                    email: 'after.change.user@gmail.com',
                });

            // then response should be OK and data should be updated
            expect(response.status).toBe(OK);
            expect(response.body.name).toBe('Before Change User');
            expect(response.body.email).toBe('after.change.user@gmail.com');
        });

        test('PATCH success: add passportId and photo', async () => {

            // given user in database
            const basicUser = {
                name: 'Before Change User',
                email: 'before.change.user@gmail.com',
            };
            const createdUser = new User(basicUser);
            const savedUser = await createdUser.save();
            const userId = savedUser._id;

            // when PATCH adding new fields
            const response = await request(app)
                .patch(`/api/users/${userId}`)
                .send({
                    passportStrategyId: 'randomIdString',
                    photo: 'http://some.link.to.pic',
                });

            // then response should be OK and data should be updated
            expect(response.status).toBe(OK);
            expect(response.body.name).toBe('Before Change User');
            expect(response.body.email).toBe('before.change.user@gmail.com');
            expect(response.body.passportStrategyId).toBe('randomIdString');
            expect(response.body.photo).toBe('http://some.link.to.pic');
        });

        test('PATCH non existent schema key', async () => {

            // given user in database
            const basicUser = {
                name: 'Before Change User',
                email: 'before.change.user@gmail.com',
            };
            const createdUser = new User(basicUser);
            const savedUser = await createdUser.save();
            const userId = savedUser._id;

            // when PATCH adding non existent field
            const response = await request(app)
                .patch(`/api/users/${userId}`)
                .send({
                    nonExistentSchemaKey: 'should not add this',
                });

            // then response should be OK and the non existent field should remain non existent
            expect(response.status).toBe(OK);
            expect(response.body.name).toBe('Before Change User');
            expect(response.body.email).toBe('before.change.user@gmail.com');
            expect(response.body.nonExistentSchemaKey).toBeUndefined;
        });

        test('PATCH non existent user', async () => {

            // when PATCH user with wrong id
            const response = await request(app)
                .patch(`/api/users/5d9f4fb63b42f22d7081125d`)
                .send({
                    name: 'After Change User',
                });

            // then response should be NOT_FOUND and error pointing out the wrong id
            expect(response.status).toBe(NOT_FOUND);
            expect(response.error.text).toBe('User not found => id:5d9f4fb63b42f22d7081125d');
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
    });
    describe('DELETE', () => {

        test('DELETE success', async () => {

            // given user in database
            const basicUser = {
                name: 'Basic User',
                email: 'basic.user@gmail.com',
            };
            const createdUser = new User(basicUser);
            const savedUser = await createdUser.save();
            const userId = savedUser._id;

            // when DELETE that user
            let response = await request(app).delete(`/api/users/${userId}`);

            // then response should be OK
            expect(response.status).toBe(OK);
            expect(response.body.name).toBe(basicUser.name);
            expect(response.body.email).toBe(basicUser.email);

            // and user should no longer be in the database
            response = await request(app).get('/api/users');
            expect(response.body).toStrictEqual([]);
        });

        test('DELETE non existent user', async () => {

            // when DELETE user with wrong id
            const response = await request(app).delete(`/api/users/5d9f4fb63b42f22d7081125d`);

            // then response should be NOT_FOUND and error pointing out the wrong id
            expect(response.status).toBe(NOT_FOUND);
            expect(response.error.text).toBe('User not found => id:5d9f4fb63b42f22d7081125d');
        });
    });
});
