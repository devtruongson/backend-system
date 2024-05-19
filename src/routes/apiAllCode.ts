import { handleCheckTokenAdmin, handleCheckTokenUserInSystem } from '~/middleware/jwtActions';
import express, { Express } from 'express';
import allCodeController from '~/controller/allCodeController';

const router = express.Router();

const initApiAllCode = (app: Express) => {
    router.post('/create', handleCheckTokenAdmin, allCodeController.createAllCode);
    router.get('/:type', allCodeController.getAllCodeByType);
    router.get(
        '/:type',
        //  handleCheckTokenUserInSystem,
        allCodeController.getAllCodeByType,
    );

    return app.use('/v1/all-code', router);
};

export default initApiAllCode;
