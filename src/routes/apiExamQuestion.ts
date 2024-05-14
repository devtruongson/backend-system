import express, { Express } from 'express';
import { handleCheckTokenTeacher } from '~/middleware/jwtActions';
import examQuestionController from '~/controller/examQuestionController';

const router = express.Router();

const initApiExamQuestion = (app: Express) => {
    router.post(
        '/',
        // handleCheckTokenTeacher,
        examQuestionController.handleCreateExamQuestion,
    );

    router.delete(
        '/:id',
        // handleCheckTokenTeacher,
        examQuestionController.handleDeleteExamQuestion,
    );

    router.put(
        '/',
        // handleCheckTokenTeacher,
        examQuestionController.handleUpdateExamQuestion,
    );

    return app.use('/v1/exam_question', router);
};

export default initApiExamQuestion;
