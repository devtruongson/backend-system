import express, { Express } from 'express';
import calendarController from '~/controller/calendarController';
import { handleCheckTokenAdmin, handleCheckTokenUser, handleCheckTokenUserInSystem } from '~/middleware/jwtActions';

const router = express.Router();

const initCalenderRouter = (app: Express) => {
    router.post('/', handleCheckTokenAdmin, calendarController.createCalendar);
    router.post('/book', handleCheckTokenUserInSystem, calendarController.chooseCalendar);
    router.get('/book/:id', handleCheckTokenUserInSystem, calendarController.getCalendarTeacher);
    router.get('/', handleCheckTokenUserInSystem, calendarController.getCalendar);
    router.get('/student', handleCheckTokenUser, calendarController.getCalendarForStudent);
    router.get('/book-for-student', handleCheckTokenAdmin, calendarController.bookCalendarForStudent);
    router.post('/student-booking', handleCheckTokenUser, calendarController.handleStudentCreateBooking);

    return app.use('/v1/calendar', router);
};

export default initCalenderRouter;
