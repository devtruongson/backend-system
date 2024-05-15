import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { bookCalendarForStudentDto } from '~/dto/bookCalendarForStudent.dto';
import { bookingCalendarDto } from '~/dto/bookingCalendar.dto';
import { createCalendarDto } from '~/dto/createCalendar.dto';
import calendarService from '~/service/calendarService';
import { ResponseHandler } from '~/utils/Response';
import { validateData } from '~/utils/validate';

class calendarController {
    async createCalendar(req: Request, res: Response) {
        try {
            const isValid = await validateData(createCalendarDto, req.body, res);
            if (!isValid) return;
            const data = await calendarService.createCalendar(req.body);
            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            console.log(err);
            return res.status(500).json(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'Error From Server'));
        }
    }

    async getCalendar(req: Request, res: Response) {
        try {
            const data = await calendarService.getCalendar();
            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            console.log(err);
            return res.status(500).json(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'Error From Server'));
        }
    }

    async chooseCalendar(req: Request, res: Response) {
        try {
            const isValid = await validateData(bookingCalendarDto, req.body, res);
            if (!isValid) return;
            const data = await calendarService.chooseCalendar(req.body);
            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            console.log(err);
            return res.status(500).json(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'Error From Server'));
        }
    }

    async getCalendarTeacher(req: Request, res: Response) {
        try {
            const data = await calendarService.getCalendarTeacher(+req.params.id, req.query.day as string | undefined);
            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            console.log(err);
            return res.status(500).json(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'Error From Server'));
        }
    }

    async bookCalendarForStudent(req: Request, res: Response) {
        try {
            const isValid = await validateData(bookCalendarForStudentDto, req.body, res);
            if (!isValid) return;
            // const data = await calendarService.bookCalendarForStudent(req.body);
            console.log('check lot');
            return res.status(httpStatus.OK).json({});
        } catch (err) {
            console.log(err);
            return res.status(500).json(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'Error From Server'));
        }
    }
}

export default new calendarController();
