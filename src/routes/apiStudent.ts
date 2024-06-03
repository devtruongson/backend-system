import express, { Express } from 'express';
import studentController from '~/controller/studentController';
import { handleCheckTokenUser } from '~/middleware/jwtActions';

const router = express.Router();

const initApiStudent = (app: Express) => {
    router.post('/register', studentController.handleCreateStudent);

    router.post('/login', studentController.handleLoginStudent);

    router.put('/', studentController.handleUpdateStudent);
    router.get('/', studentController.handleGetAllStudent);
    router.get('/count', studentController.handleGetCountStudent);

    router.get('/:email', handleCheckTokenUser, studentController.handleGetInfoStudent);

    return app.use('/v1/student', router);
};

export default initApiStudent;
