import express, { Express } from 'express';
import calendarController from '~/controller/calendarController';
import {
    handleCheckTokenAdmin,
    handleCheckTokenSale,
    handleCheckTokenUser,
    handleCheckTokenUserInSystem,
} from '~/middleware/jwtActions';

const router = express.Router();

const initCalenderRouter = (app: Express) => {
    router.post('/', handleCheckTokenAdmin, calendarController.createCalendar);
    router.post(
        '/book',
        //  handleCheckTokenUserInSystem,
        calendarController.chooseCalendar,
    );
    router.get(
        '/book/:id',
        //  handleCheckTokenUserInSystem,
        calendarController.getCalendarTeacher,
    );
    router.get(
        '/',
        //  handleCheckTokenUserInSystem,
        calendarController.getCalendar,
    );

    router.get(
        '/book-exam',
        //  handleCheckTokenUserInSystem,
        calendarController.handleGetCalendarToBookExam,
    );

    router.get('/search', calendarController.handleSearchCalendar);

    router.get('/student', handleCheckTokenUser, calendarController.getCalendarForStudent);
    router.post('/student-booking', handleCheckTokenUser, calendarController.handleStudentCreateBooking);
    router.post('/book-for-student', handleCheckTokenAdmin, calendarController.bookCalendarForStudent);
    router.delete('/unbooking', calendarController.handleUnBooking);
    router.patch(
        '/',
        // handleCheckTokenSale,
        calendarController.handleAddStudentToCalendar,
    );

    return app.use('/v1/calendar', router);
};

export default initCalenderRouter;
