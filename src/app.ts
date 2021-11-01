import express from 'express';
import config from './config';
import logger from './utilities/logger';

export default (): Promise<express.Application> =>
  new Promise<express.Application>((resolve, reject) => {
    try {
      const app = express();

      // set middleware
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));

      // test api route
      app.get(
        config.API_URL,
        async (
          req: express.Request,
          res: express.Response
        ): Promise<express.Response> => {
          return res.json({ 'Bestfriend API': 'Version 1' });
        }
      );

      resolve(app);
    } catch (error) {
      logger.error(`Error when bootstrapping app: ${error}`);
      reject(error);
    }
  });
