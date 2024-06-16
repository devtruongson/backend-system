import express, { Express } from 'express';
import { handleCheckTokenTeacher, handleCheckTokenUser } from '~/middleware/jwtActions';
import examController from '~/controller/examController';

const router = express.Router();

const initApiExam = (app: Express) => {
    router.post(
        '/',
        // handleCheckTokenTeacher,
        examController.handleCreateExam,
    );

    router.get('/student', examController.handleGetExam);
    router.get('/student-desc', examController.handleGetExamDESC);

    router.get(
        '/teacher',
        // handleCheckTokenTeacher,
        examController.handleGetExam,
    );

    router.get('/get-one', examController.handleGetOneExam);
    router.patch('/change-status', examController.ChangeStatus);

    router.delete(
        '/:id',
        // handleCheckTokenTeacher,
        examController.handleDeleteExam,
    );

    router.put(
        '/',
        // handleCheckTokenTeacher,
        examController.handleUpdateInfoExam,
    );

    router.put('/score', examController.handleUpdateScoreExam);

    router.get('/search', examController.handleSearch);

    return app.use('/v1/exam', router);
};

export default initApiExam;
