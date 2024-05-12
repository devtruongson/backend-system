import express, { Express } from 'express';
import userController from '~/controller/userController';
import { handleCheckTokenAdmin } from '~/middleware/jwtActions';

const router = express.Router();

const initApiUser = (app: Express) => {
    router.post('/login', userController.handleLogin);
    router.get('/get-user', userController.handleGet);
    router.post('/create', userController.handleCreateUser);
    router.get('/all', handleCheckTokenAdmin, userController.getAllUsers);

    return app.use('/v1/user', router);
};

export default initApiUser;
