// config environment variables
import dotenv from 'dotenv';
dotenv.config();
import config from './config';
import bootstrapApp from './app';
import logger from './utilities/logger';
import connectToDbClient from './database/db_client';

const runApp = async () => {
  try {
    logger.debug(`[START]: Bootstrapping app`);
    const PORT = process.env.PORT || config.APP_PORT;

    const app = await bootstrapApp();

    // connect to database
    await connectToDbClient();

    app.listen(PORT, () => logger.info(`App running on PORT: ${PORT}`));

    return app;
  } catch (error) {
    logger.error(`Failed to run app: ${error}`);
  }
};

(async () => await runApp())();
