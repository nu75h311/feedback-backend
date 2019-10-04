import mongoose from 'mongoose';
import { logger } from '@shared';

const connectDb = () => {
  const { DB_URL } = process.env;
  mongoose.connect(`mongodb://${DB_URL}`,
    {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    },
    (err) => {
      if (err) { logger.error(err); }
    });
  const { connection } = mongoose;

  return connection.once('open', () => {
    logger.info('MongoDB database connection established successfully');
  });
};

const disconnectDb = async () => {
  await mongoose.connection.close();
  logger.info('MongoDB database diconnected');
};

export { connectDb, disconnectDb };
