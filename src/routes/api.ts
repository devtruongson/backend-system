import { Express } from 'express';
import initApiUser from './apiUser';
import initApiCourse from './apiCourse';
import initApiAllCode from './apiAllCode';
import initApiAnswer from './apiAnswer';
import initApiQuestion from './apiQuestion';
import initCalenderRouter from './apiCalendar';
import initApiExamQuestion from './apiExamQuestion';
import initApiExam from './apiExam';
import initApiStudent from './apiStudent';
import initApiParent from './apiParent';
import initApiLog from './apiLog';

const initApiRoutes = (app: Express) => {
    initApiUser(app);
    initApiCourse(app);
    initApiAllCode(app);
    initApiAnswer(app);
    initApiQuestion(app);
    initCalenderRouter(app);
    initApiExam(app);
    initApiExamQuestion(app);
    initApiStudent(app);
    initApiParent(app);
    initApiLog(app);
};

export default initApiRoutes;
