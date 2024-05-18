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
<<<<<<< HEAD
    router.get('/book-for-student', handleCheckTokenAdmin, calendarController.bookCalendarForStudent);
    router.post('/student-booking', handleCheckTokenUser, calendarController.handleStudentCreateBooking);
=======
    router.post('/book-for-student', handleCheckTokenAdmin, calendarController.bookCalendarForStudent);
>>>>>>> ea6b50578591ff2dd078729190f7710bb3ce4072

    return app.use('/v1/calendar', router);
};

export default initCalenderRouter;
