import express, { Express } from 'express';
import calendarController from '~/controller/calendarController';
import { handleCheckTokenAdmin, handleCheckTokenUserInSystem } from '~/middleware/jwtActions';

const router = express.Router();

const initCalenderRouter = (app: Express) => {
    router.post('/', handleCheckTokenAdmin, calendarController.createCalendar);
    router.post('/book', handleCheckTokenUserInSystem, calendarController.chooseCalendar);
    router.get('/book/:id', handleCheckTokenUserInSystem, calendarController.getCalendarTeacher);
    router.get('/', calendarController.getCalendar);

    return app.use('/v1/calendar', router);
};

export default initCalenderRouter;
