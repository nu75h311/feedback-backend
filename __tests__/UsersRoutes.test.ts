import request from 'supertest';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';

import app from '@server';
import { logger } from '@shared';

import { userModel as User } from '@models';
import { IUser } from '@interfaces';
import { MemoryDb } from './support/_setupDb';
import { Server } from 'http';

// May require additional time for downloading MongoDB binaries
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

let server: Server;
const memoryDb: MemoryDb = new MemoryDb();

beforeAll(async () => {
    memoryDb.initDb();

    const PORT = Number(process.env.PORT || 3000);
    server = app.listen(PORT, () => {
        logger.info(`Express server started on port: ${PORT}`);
    });
});

afterAll(async () => {
    server.close();
    await memoryDb.teardownDb();
});

afterEach(async () => {
    await memoryDb.cleanDb();
});

describe('/api/users', () => {
    test('GET', async () => {

        // give user in database
        const basicUser: IUser = {
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

    test('POST', async () => {

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
});
