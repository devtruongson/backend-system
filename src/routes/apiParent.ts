import express, { Express } from 'express';
import parentController from '~/controller/parentController';

const router = express.Router();

const initApiParent = (app: Express) => {
    router.post('/', parentController.handleCreateParent);

    router.delete('/:id', parentController.handleDeleteParent);

    return app.use('/v1/parent', router);
};

export default initApiParent;
