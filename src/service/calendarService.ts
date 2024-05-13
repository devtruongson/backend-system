import httpStatus from 'http-status';
import { bookingCalendarDto } from '~/dto/bookingCalendar.dto';
import { createCalendarDto } from '~/dto/createCalendar.dto';
import Calendar from '~/models/Calendar';
import CalendarTeacher from '~/models/CalendarTeacher';
import Student from '~/models/Student';
import User from '~/models/User';
import { ResponseHandler } from '~/utils/Response';

class calendarService {
    async createCalendar(data: createCalendarDto) {
        try {
            await Calendar.bulkCreate(data as any, {
                fields: ['time_start', 'time_end'],
            });

            return ResponseHandler(httpStatus.OK, null, 'tao moi thanh cong calendar!');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    async getCalendar() {
        try {
            const data = await Calendar.findAll({
                attributes: ['id', 'time_start', 'time_end'],
            });
            return ResponseHandler(httpStatus.OK, data, 'ok');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    async chooseCalendar(data: bookingCalendarDto) {
        try {
            const [checkValidTeacher, checkCountValid] = await Promise.all([
                await CalendarTeacher.findOne({
                    where: {
                        teacher_id: data.teacher_id,
                        day: data.day,
                        calendar_id: data.calendar_id,
                    },
                }),
                await CalendarTeacher.count({
                    where: {
                        day: data.day,
                        calendar_id: data.calendar_id,
                    },
                }),
            ]);
            if (checkValidTeacher) {
                return ResponseHandler(httpStatus.OK, null, 'Bạn đã đăng ký lịch này');
            }
            if (checkCountValid >= 3) {
                return ResponseHandler(httpStatus.OK, null, 'Đã đủ số lượng thầy cô đăng ký');
            }

            await CalendarTeacher.create({
                ...data,
            });
            return ResponseHandler(httpStatus.OK, data, 'ok');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    async getCalendarTeacher(id: number, filterDay?: string) {
        try {
            const query: any = {};

            if (filterDay) {
                query.day = filterDay;
            }

            const data = await CalendarTeacher.findAll({
                where: {
                    teacher_id: id,
                    ...query,
                },
                include: [
                    {
                        model: Calendar,
                        as: 'calendarTeacherData',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                    },
                    {
                        model: User,
                        as: 'teacherData',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'password'],
                        },
                    },
                    {
                        model: Student,
                        as: 'studentData',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'password'],
                        },
                    },
                ],
            });
            return ResponseHandler(httpStatus.OK, data, 'ok');
        } catch (error) {
            console.log(error);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }
}

export default new calendarService();
