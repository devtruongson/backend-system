import { handleCheckTokenAdmin } from '~/middleware/jwtActions';
import express, { Express } from 'express';
import allCodeController from '~/controller/allCodeController';

const router = express.Router();

const initApiAllCode = (app: Express) => {
    router.post('/create', allCodeController.createAllCode);

    return app.use('/v1/all-code', router);
};

export default initApiAllCode;
