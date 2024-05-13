import express, { Express } from 'express';
import answerController from '~/controller/answerController';
import { handleCheckTokenTeacher } from '~/middleware/jwtActions';

const router = express.Router();

const initApiQuestion = (app: Express) => {
    router.post(
        '/',
        // handleCheckTokenTeacher,
        answerController.handleCreateAnswer,
    );

    router.get(
        '/',
        // handleCheckTokenTeacher,
        answerController.handleGetAnswer,
    );

    router.delete(
        '/:id',
        // handleCheckTokenTeacher,
        answerController.handleDeleteAnswer,
    );

    router.put(
        '/update',
        // handleCheckTokenTeacher,
        answerController.handleUpdateAnswer,
    );

    return app.use('/v1/answer', router);
};

export default initApiQuestion;
