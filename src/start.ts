import app from '@server';
import { logger } from '@shared';

// Start the server
const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
    logger.info(`Express server started on port: ${PORT}`);
});
