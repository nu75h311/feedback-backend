import request from 'supertest';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';

import app from '@server';
import { logger } from '@shared';
import { User } from '@models';

import { MemoryDb } from './support/_setupDb';
import { Server } from 'http';

export const routesForUsersTests = function () {
    // May require additional time for downloading MongoDB binaries
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

    let server: Server;
    const memoryDb: MemoryDb = new MemoryDb();

    beforeAll(async () => {
        memoryDb.initDb();

        const PORT = 3000;
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
        await createdUser.save();

        // when GET all users
        const response = await request(app).get('/api/users');

        // then response should be OK and data should be correct
        expect(response.status).toBe(OK);
        expect(response.body[0]._id).toBeDefined;
        expect(response.body[0].name).toBe(basicUser.name);
        expect(response.body[0].email).toBe(basicUser.email);
    });

    test('POST success', async () => {

        // when POST a user
        const response = await request(app)
            .post('/api/users')
            .send({
                name: 'Created User',
                email: 'created.user@gmail.com',
            });

        // then response should be OK and created user should be returned
        expect(response.status).toBe(CREATED);
        expect(response.body._id).toBeDefined;
        expect(response.body.name).toBe('Created User');
        expect(response.body.email).toBe('created.user@gmail.com');
    });

    test('POST missing \'name\'', async () => {

        // when POST a user without name field
        const response = await request(app)
            .post('/api/users')
            .send({
                email: 'created.user@gmail.com',
            });

        // then response should be BAD_REQUEST and error pointing out the missing 'name'
        expect(response.status).toBe(BAD_REQUEST);
        expect(response.error.text).toMatch(/error: User validation failed: name: Path `name` is required./);
    });

    test('POST missing \'email\'', async () => {

        // when POST a user without email field
        const response = await request(app)
            .post('/api/users')
            .send({
                name: 'Created User',
            });

        // then response should be BAD_REQUEST and error pointing out the missing 'email'
        expect(response.status).toBe(BAD_REQUEST);
        expect(response.error.text).toMatch(/error: User validation failed: email: Path `email` is required./);
    });

    test('POST using existing email', async () => {

        // given user in database
        const basicUser = {
            name: 'Basic User',
            email: 'basic.user@gmail.com',
        };
        const createdUser = new User(basicUser);
        await createdUser.save();

        // when POST a user using an existing email
        const response = await request(app)
            .post('/api/users')
            .send({
                name: 'Another User',
                email: 'basic.user@gmail.com',
            });

        // then response should be BAD_REQUEST and error pointing out the existing email
        expect(response.status).toBe(BAD_REQUEST);
        expect(response.error.text).toMatch(/error: E11000 duplicate key error dup key: { : "basic.user@gmail.com" }/);
    });
}
