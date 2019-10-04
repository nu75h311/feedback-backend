import request from 'supertest';

import app from '@server';
import { logger } from '@shared';

import { userModel as User } from '@models';
import { IUser } from '@interfaces';
import { MemoryDb } from '../_setupDb';
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

test('GET /api/users/all', async () => {

    const basicUser: IUser = {
        "name": "Basic User",
        "email": "basic.user@gmail.com",
    };
    const createdUser = new User(basicUser);
    await createdUser.save();

    const response = await request(app).get('/api/users/all');
    expect(response.status).toBe(200);
    expect(response.body[0].name).toBe(basicUser.name);
    expect(response.body[0].email).toBe(basicUser.email);
});