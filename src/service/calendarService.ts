import httpStatus from 'http-status';
import { Op } from 'sequelize';
import { bookCalendarForStudentDto } from '~/dto/bookCalendarForStudent.dto';
import { bookingCalendarDto } from '~/dto/bookingCalendar.dto';
import { createCalendarDto } from '~/dto/createCalendar.dto';
import { studentDto } from '~/dto/createStudent.dto';
import { studentBookingDto } from '~/dto/studentBooking';
import AllCode from '~/models/AllCode';
import Answer from '~/models/Answer';
import Calendar from '~/models/Calendar';
import CalendarTeacher from '~/models/CalendarTeacher';
import Course from '~/models/Course';
import Exam from '~/models/Exam';
import ExamQuestion from '~/models/ExamQuestion';
import Question from '~/models/Question';
import Student from '~/models/Student';
import StudentCourse from '~/models/StudentCourse';
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

    async getCalendarTeacher(id: number, filterDay?: string, filter?: string) {
        try {
            const query: any = {};

            if (id) {
                query.teacher_id = id;
            } else {
                query.student_id = {
                    [Op.is]: null,
                };
            }

            if (filterDay) {
                query.time_stamp_start = {
                    [Op.gte]: filterDay,
                };
            }

            const data = await CalendarTeacher.findAll({
                where: {
                    ...query,
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt'],
                },
                include: [
                    {
                        model: Calendar,
                        as: 'calendarData',
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
                    {
                        model: StudentCourse,
                        as: 'StudentCourseData',
                        include: [
                            {
                                model: Course,
                                as: 'CourseData',
                                attributes: {
                                    exclude: ['createdAt', 'updatedAt'],
                                },
                                include: [
                                    {
                                        model: AllCode,
                                        as: 'TrainingSectorData',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });
            return ResponseHandler(httpStatus.OK, data, 'ok');
        } catch (error) {
            console.log(error);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    async getCalendarForStudent(email: string) {
        try {
            const checkUserExit: any = await Student.findOne({
                where: { email: email },
                raw: true,
            });

            console.log(checkUserExit);

            if (!checkUserExit) {
                return ResponseHandler(httpStatus.BAD_REQUEST, null, 'student not found');
            }

            const data = await CalendarTeacher.findOne({
                where: {
                    student_id: checkUserExit.id,
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt'],
                },
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: Calendar,
                        as: 'calendarData',
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

    async bookCalendarForStudent(data: bookCalendarForStudentDto) {
        try {
            const checkExitCalendar = await CalendarTeacher.findOne({
                where: {
                    id: data.calendar_id,
                    student_id: {
                        [Op.ne]: null,
                    },
                    teacher_id: data.teacher_id,
                },
            });

            if (checkExitCalendar) {
                return ResponseHandler(httpStatus.BAD_REQUEST, null, 'Bản lịch này đã có người đặt');
            }

            await CalendarTeacher.update(
                {
                    student_id: data.student_id,
                },
                {
                    where: {
                        id: data.calendar_id,
                        teacher_id: data.teacher_id,
                    },
                },
            );

            await StudentCourse.update(
                {
                    calendar_id: data.calendar_id,
                },
                {
                    where: {
                        id: data.id_student_course,
                    },
                },
            );

            return ResponseHandler(httpStatus.OK, null, 'ok');
        } catch (error) {
            console.log(error);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    async studentBooking(data: studentBookingDto) {
        try {
            let checkIsValid = await StudentCourse.findOne({
                where: { student_id: data.student_id, course_id: data.course_id },
            });

            if (checkIsValid) {
                return ResponseHandler(httpStatus.BAD_REQUEST, null, 'Khóa học đã được mua');
            }
            await StudentCourse.create({
                ...data,
                calendar_id: null,
                is_confirm: true,
            });
            return ResponseHandler(httpStatus.OK, null, 'Mua khóa hoc thành công');
        } catch (error) {
            console.log(error);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    async unbookingService(timeStart: string, idTeacher?: number) {
        try {
            const query: any = {};

            if (idTeacher) {
                query.teacher_id = +idTeacher;
            }

            await CalendarTeacher.destroy({
                where: { time_stamp_start: timeStart, ...query },
            });

            return ResponseHandler(httpStatus.OK, null, 'Mua khóa hoc thành công');
        } catch (error) {
            console.log(error);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    async getToBookExamService(page: number, pageSize: number, idTeacher: number, isNotStudent: string = 'false') {
        try {
            if (!page || !pageSize || !idTeacher) {
                return ResponseHandler(httpStatus.BAD_REQUEST, null, 'Cần nhập đủ các trường');
            }

            let query: any = {};
            if (isNotStudent === 'true') {
                query.student_id = {
                    [Op.is]: null,
                };
            } else {
                query.student_id = {
                    [Op.not]: null,
                };
            }

            let offset: number = (page - 1) * pageSize;
            let { count, rows } = await CalendarTeacher.findAndCountAll({
                where: {
                    teacher_id: idTeacher,
                    ...query,
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt'],
                },
                include: [
                    {
                        model: Student,
                        as: 'studentData',
                        attributes: {
                            exclude: ['password', 'createdAt', 'updatedAt'],
                        },
                        include: [
                            {
                                model: Exam,
                                as: 'examData',
                                attributes: {
                                    exclude: ['createdAt', 'updatedAt'],
                                },
                                include: [
                                    {
                                        model: ExamQuestion,
                                        as: 'ExamQuestionData',
                                        attributes: {
                                            exclude: ['createdAt', 'updatedAt'],
                                        },
                                        include: [
                                            {
                                                model: Question,
                                                as: 'QuestionData',
                                                attributes: {
                                                    exclude: ['createdAt', 'updatedAt'],
                                                },
                                                include: [
                                                    {
                                                        model: Answer,
                                                        as: 'answers',
                                                        attributes: {
                                                            exclude: ['createdAt', 'updatedAt'],
                                                        },
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        model: User,
                        as: 'teacherData',
                        attributes: {
                            exclude: ['password', 'createdAt', 'updatedAt'],
                        },
                    },
                ],
                offset: +offset,
                limit: +pageSize,
            });

            let data = {
                items: rows,
                meta: {
                    currentPage: page,
                    totalIteams: count,
                    totalPages: Math.ceil(count / pageSize),
                },
            };
            return ResponseHandler(httpStatus.OK, data, 'Calendar teacher');
        } catch (error) {
            console.log(error);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    async searchCalendarService(textSearch: string) {
        try {
            if (!textSearch) {
                return ResponseHandler(httpStatus.OK, null, 'Calendar teacher');
            }

            let listStudent = (await Student.findAll({
                where: {
                    [Op.or]: [
                        { fullName: { [Op.like]: `%${textSearch}%` } },
                        { phoneNumber: { [Op.like]: `%${textSearch}%` } },
                        { email: { [Op.like]: `%${textSearch}%` } },
                    ],
                },
                raw: true,
            })) as studentDto[] | [];

            const listId: number[] = listStudent.map((item) => {
                return item.id;
            });

            const listCalendar = await CalendarTeacher.findAll({
                where: {
                    student_id: {
                        [Op.in]: listId,
                    },
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt'],
                },
                include: [
                    {
                        model: Student,
                        as: 'studentData',
                        attributes: {
                            exclude: ['password', 'createdAt', 'updatedAt'],
                        },
                        include: [
                            {
                                model: Exam,
                                as: 'examData',
                                attributes: {
                                    exclude: ['createdAt', 'updatedAt'],
                                },
                                include: [
                                    {
                                        model: ExamQuestion,
                                        as: 'ExamQuestionData',
                                        attributes: {
                                            exclude: ['createdAt', 'updatedAt'],
                                        },
                                        include: [
                                            {
                                                model: Question,
                                                as: 'QuestionData',
                                                attributes: {
                                                    exclude: ['createdAt', 'updatedAt'],
                                                },
                                                include: [
                                                    {
                                                        model: Answer,
                                                        as: 'answers',
                                                        attributes: {
                                                            exclude: ['createdAt', 'updatedAt'],
                                                        },
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        model: User,
                        as: 'teacherData',
                        attributes: {
                            exclude: ['password', 'createdAt', 'updatedAt'],
                        },
                    },
                ],
            });

            return ResponseHandler(httpStatus.OK, listCalendar, 'Calendar teacher');
        } catch (error) {
            console.log(error);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    async addStudentToCalendarService(idStudent: number, idCalendar: number, status?: string) {
        try {
            let query: any = {};

            if (!idStudent) {
                query.student_id = null;
            } else {
                query.student_id = idStudent;
            }

            const calendarOld = (await CalendarTeacher.findOne({
                where: {
                    student_id: idStudent,
                },
                raw: true,
            })) as bookingCalendarDto | null;

            if (status) {
                console.log(status);
                switch (status) {
                    case 'is_reservation': {
                        query.is_reservation = true;
                        query.is_confirm = false;
                        query.is_interviewed_meet = false;
                        break;
                    }

                    case 'is_confirm': {
                        query.is_reservation = false;
                        query.is_confirm = true;
                        query.is_interviewed_meet = false;
                        break;
                    }

                    case 'is_interviewed_meet': {
                        query.is_reservation = false;
                        query.is_confirm = false;
                        query.is_interviewed_meet = true;
                        break;
                    }
                }
            }

            if (calendarOld) {
                await CalendarTeacher.update(
                    {
                        student_id: null,
                    },
                    {
                        where: {
                            id: calendarOld.id,
                        },
                    },
                );
            }

            await CalendarTeacher.update(
                {
                    ...query,
                },
                {
                    where: {
                        id: idCalendar,
                    },
                },
            );

            return ResponseHandler(httpStatus.OK, null, 'Update succses');
        } catch (error) {
            console.log(error);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    async handleGetAllCalendar(idUser?: string) {
        try {
            const query: any = {};

            if (idUser) {
                query.teacher_id = parseInt(idUser);
            }

            const timeCurrent = new Date().getTime();
            const data = await CalendarTeacher.findAll({
                where: {
                    student_id: {
                        [Op.eq]: null,
                    },
                    ...query,
                    time_stamp_start: {
                        [Op.gte]: timeCurrent,
                    },
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt'],
                },
                include: [
                    {
                        model: Student,
                        as: 'studentData',
                        attributes: {
                            exclude: ['password', 'createdAt', 'updatedAt'],
                        },
                        include: [
                            {
                                model: Exam,
                                as: 'examData',
                            },
                        ],
                    },
                    {
                        model: User,
                        as: 'teacherData',
                        attributes: {
                            exclude: ['password', 'createdAt', 'updatedAt'],
                        },
                    },
                ],
            });
            return ResponseHandler(httpStatus.OK, data, 'Calendar teacher');
        } catch (error) {
            console.log(error);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    async handleChangeStatus(status: string, id: number, idCalendar: number, isCancel?: string) {
        try {
            if (!status || !id || !idCalendar) {
                return ResponseHandler(httpStatus.BAD_REQUEST, null, 'Missing required parameters');
            }

            const query: any = {};
            if (!isCancel) {
                switch (status) {
                    case 'is_reservation': {
                        query.is_reservation = true;
                        query.is_confirm = false;
                        query.is_interviewed_meet = false;
                        break;
                    }

                    case 'is_confirm': {
                        query.is_reservation = false;
                        query.is_confirm = true;
                        query.is_interviewed_meet = false;
                        break;
                    }

                    case 'is_interviewed_meet': {
                        query.is_reservation = false;
                        query.is_confirm = false;
                        query.is_interviewed_meet = true;
                        break;
                    }
                }
            } else {
                query.is_reservation = false;
                query.is_confirm = false;
                query.is_interviewed_meet = false;
                query.is_cancel = true;
            }
            await CalendarTeacher.update(
                {
                    ...query,
                },
                {
                    where: {
                        student_id: +id,
                        id: +idCalendar,
                    },
                },
            );

            return ResponseHandler(httpStatus.OK, null, 'Calendar teacher');
        } catch (error) {
            console.log(error);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }
}

export default new calendarService();
