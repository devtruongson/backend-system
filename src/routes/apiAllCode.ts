import express, { Express } from 'express';
import allCodeController from '~/controller/allCodeController';
import { handleCheckTokenAmin } from '~/middleware/jwtActions';

const router = express.Router();

const initApiAllCode = (app: Express) => {
    router.post('/create', handleCheckTokenAmin, allCodeController.createAllCode);

    return app.use('/v1/all-code', router);
};

export default initApiAllCode;
