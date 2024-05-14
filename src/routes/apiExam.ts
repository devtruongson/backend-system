import express, { Express } from 'express';
import { handleCheckTokenTeacher } from '~/middleware/jwtActions';
import examController from '~/controller/examController';

const router = express.Router();

const initApiExam = (app: Express) => {
    router.post(
        '/',
        // handleCheckTokenTeacher,
        examController.handleCreateExam,
    );

    router.get(
        '/',
        // handleCheckTokenTeacher,
        examController.handleGetExam,
    );

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

    return app.use('/v1/exam', router);
};

export default initApiExam;
