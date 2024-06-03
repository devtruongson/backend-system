import express, { Express } from 'express';
import studentController from '~/controller/studentController';
import { handleCheckTokenUser } from '~/middleware/jwtActions';

const router = express.Router();

const initApiStudent = (app: Express) => {
    router.post('/register', studentController.handleCreateStudent);

    router.post('/login', studentController.handleLoginStudent);

    router.put('/', studentController.handleUpdateStudent);
    router.get('/', studentController.handleGetAllStudent);

    router.get('/:email', handleCheckTokenUser, studentController.handleGetInfoStudent);

    // router.get('/student-math', handleCheckTokenUser, studentController.handleStudentMath);

    return app.use('/v1/student', router);
};

export default initApiStudent;
