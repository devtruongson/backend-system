import express, { Express } from 'express';
import studentController from '~/controller/studentController';

const router = express.Router();

const initApiStudent = (app: Express) => {
    router.post('/register', studentController.handleCreateStudent);

    router.post('/login', studentController.handleLoginStudent);

    router.put('/', studentController.handleUpdateStudent);

    return app.use('/v1/student', router);
};

export default initApiStudent;
