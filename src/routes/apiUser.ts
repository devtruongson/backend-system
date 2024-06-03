import express, { Express } from 'express';
import userController from '~/controller/userController';
import { handleCheckTokenSale, handleCheckTokenUserInSystem } from '~/middleware/jwtActions';

const router = express.Router();

const initApiUser = (app: Express) => {
    router.post('/login', userController.handleLogin);
    router.get('/get-user', userController.handleGet);
    router.post('/create', userController.handleCreateUser);
    router.post('/create-bulk', userController.handleCreateUserBulk);
    router.get('/all', userController.getAllUsers);
    router.get('/all-by-type', userController.getAllUsersByType);
    router.get('/:id', handleCheckTokenUserInSystem, userController.getOneUser);

    return app.use('/v1/user', router);
};

export default initApiUser;
