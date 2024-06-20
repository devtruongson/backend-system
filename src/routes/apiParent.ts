import express, { Express } from 'express';
import parentController from '~/controller/parentController';
import { handleCheckTokenSale, handleCheckTokenUser } from '~/middleware/jwtActions';

const router = express.Router();

const initApiParent = (app: Express) => {
    router.post(
        '/',
        //  handleCheckTokenUser,
        parentController.handleCreateParent,
    );

    router.delete('/:id', handleCheckTokenSale, parentController.handleDeleteParent);

    router.put('/', handleCheckTokenSale, parentController.handleUpdateInfoParent);

    router.get('/:id', handleCheckTokenUser, parentController.handleGetParent);

    return app.use('/v1/parent', router);
};

export default initApiParent;
