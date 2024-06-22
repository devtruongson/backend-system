import express, { Express } from 'express';
import studentController from '~/controller/studentController';
import { handleCheckTokenSale, handleCheckTokenUser, handleCheckTokenUserInSystem } from '~/middleware/jwtActions';

const router = express.Router();

const initApiStudent = (app: Express) => {
    router.post('/register', handleCheckTokenSale, studentController.handleCreateStudent);

    router.post('/login', studentController.handleLoginStudent);
    router.post('/create-bulk', studentController.CreateStudentBulk);
    router.put('/', studentController.handleUpdateStudent);
    router.get('/', studentController.handleGetAllStudent);
    router.get('/one/:id', studentController.handleGetOneStudent);
    router.get('/count', studentController.handleGetCountStudent);
    router.get('/interview', studentController.handleInterView);

    router.patch('/update-level', studentController.handleUpdateLevel);
    router.get('/:email', handleCheckTokenUser, studentController.handleGetInfoStudent);
    router.get('/search', studentController.handleSearch);

    router.delete('/:id', studentController.handleDelete);

    return app.use('/v1/student', router);
};

export default initApiStudent;
