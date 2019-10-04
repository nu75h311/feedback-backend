import mongoose from 'mongoose';
import { MongoMemoryServer } from "mongodb-memory-server";
import { logger } from '@shared';

// Sets up and tears down an in-memory MongoDB for test runtime
export class MemoryDb {
    mongoServer: MongoMemoryServer = new MongoMemoryServer();

    initDb = async () => {
        mongoose.Promise = Promise;

        const mongoUri = await this.mongoServer.getConnectionString();
        const mongooseOpts = {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        };

        mongoose.connect(mongoUri, mongooseOpts);

        mongoose.connection.once('open', () => {
            logger.info('MongoDB database connection established successfully');
        });
    }

    teardownDb = async () => {
        await mongoose.disconnect();
        await this.mongoServer.stop();
    }
}