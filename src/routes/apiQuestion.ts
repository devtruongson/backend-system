import express, { Express } from 'express';
import { handleCheckTokenTeacher } from '~/middleware/jwtActions';
import questionController from '~/controller/questionController';

const router = express.Router();

const initApiQuestion = (app: Express) => {
    router.post(
        '/',
        // handleCheckTokenTeacher,
        questionController.handleCreateQuestion,
    );

    router.get(
        '/',
        // handleCheckTokenTeacher,
        questionController.handleGetQuestion,
    );

    router.delete(
        '/:id',
        // handleCheckTokenTeacher,
        questionController.handleDeleteQuestion,
    );

    router.put(
        '/',
        // handleCheckTokenTeacher,
        questionController.handleUpdateQuestion,
    );

    router.post('/bulk-create', questionController.handleBilkCreateQuestion);

    return app.use('/v1/question', router);
};

export default initApiQuestion;
