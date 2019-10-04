import app from '@server';
import { logger } from '@shared';

import { connectDb } from './databaseHandler';

// Connect to the database
connectDb();

// Start the server
const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
    logger.info(`Express server started on port: ${PORT}`);
});
