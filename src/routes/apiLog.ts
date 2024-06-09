import express, { Express } from 'express';
import logController from '~/controller/logController';
const router = express.Router();

const initApiLog = (app: Express) => {
    router.get('/', logController.getAllLog);
    return app.use('/v1/log', router);
};

export default initApiLog;
