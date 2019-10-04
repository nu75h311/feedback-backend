import mongoose from 'mongoose';
import { MongoMemoryServer } from "mongodb-memory-server";
import { userModel as User } from '@models';
import { IUser } from '@interfaces';

// Sets up and tears down an in-memory MongoDB for test runtime

let mongoServer: MongoMemoryServer;

export const initDb = async (): Promise<MongoMemoryServer> => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getConnectionString();
    await mongoose.connect(mongoUri,
        {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        },
        (err) => {
            if (err) console.error(err);
        });
    const basicUser: IUser = {
        "name": "Basic User",
        "email": "basic.user@gmail.com",
    };
    const createdUser = new User(basicUser);
    await createdUser.save();
    return mongoServer;
};

export const teardownDb = async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
};