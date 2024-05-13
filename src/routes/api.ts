import { Express } from 'express';
import initApiUser from './apiUser';
import initApiCourse from './apiCourse';
import initApiAllCode from './apiAllCode';
import initApiAnswer from './apiAnswer';
import initApiQuestion from './apiQuestion';
import initCalenderRouter from './apiCalendar';

const initApiRoutes = (app: Express) => {
    initApiUser(app);
    initApiCourse(app);
    initApiAllCode(app);
    initApiAnswer(app);
    initApiQuestion(app);
    initCalenderRouter(app);
};

export default initApiRoutes;
