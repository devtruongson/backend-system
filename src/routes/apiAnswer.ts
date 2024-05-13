import express, { Express } from 'express';

const router = express.Router();

const initApiAnswer = (app: Express) => {
    return app.use('/v1/course', router);
};

export default initApiAnswer;
