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
    router.get('/student', handleCheckTokenUserInSystem, calendarController.getCalendarForStudent);

    router.get(
        '/book-exam',
        //  handleCheckTokenUserInSystem,
        calendarController.handleGetCalendarToBookExam,
    );

    router.get('/all', calendarController.handleGetAllCalendar);

    router.get('/search', calendarController.handleSearchCalendar);

    router.get('/student', handleCheckTokenUser, calendarController.getCalendarForStudent);
    router.get('/student-map', handleCheckTokenUserInSystem, calendarController.getCalendarForStudentMap);
    router.post('/student-booking', handleCheckTokenUser, calendarController.handleStudentCreateBooking);
    router.post('/book-for-student', handleCheckTokenAdmin, calendarController.bookCalendarForStudent);
    router.delete('/unbooking', calendarController.handleUnBooking);
    router.patch(
        '/',
        // handleCheckTokenSale,
        calendarController.handleAddStudentToCalendar,
    );
    router.patch('/change-status', calendarController.handleChangeStatus);

    router.get('/get-schedule', calendarController.handleGetSchedule);
    router.get('/count-schedule-teacher', calendarController.handleCountScheduleTeacher);

    router.put('/change-note', calendarController.handleChangeNote);

    return app.use('/v1/calendar', router);
};

export default initCalenderRouter;
