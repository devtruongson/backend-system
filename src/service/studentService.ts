import { Response } from 'express';
import httpStatus from 'http-status';
import { Op, where } from 'sequelize';
import { studentDto } from '~/dto/createStudent.dto';
import { loginDto } from '~/dto/login.dto';
import { comparePassword, endCodePassword } from '~/helpers/bcrypt';
import { handleRemoveFile } from '~/helpers/handleRemoveImg';
import { handleCreateToken } from '~/middleware/jwtActions';
import AllCode from '~/models/AllCode';
import Answer from '~/models/Answer';
import Calendar from '~/models/Calendar';
import CalendarTeacher from '~/models/CalendarTeacher';
import Exam from '~/models/Exam';
import ExamQuestion from '~/models/ExamQuestion';
import Log from '~/models/Log';
import Parent from '~/models/Parent';
import Question from '~/models/Question';
import Student from '~/models/Student';
import User from '~/models/User';
import dotenv from 'dotenv';
dotenv.config();

import { ResponseHandler } from '~/utils/Response';
import { examDto } from '~/dto/createExam.dto';
import { createCalendarDto } from '~/dto/createCalendar.dto';

class studentService {
    async checkStudentExit(
        email: string,
        type: 'check' | 'query' = 'check',
    ): Promise<
        | boolean
        | {
              Student: studentDto | null;
              isValid: boolean;
          }
    > {
        let isValid = false;
        const student = (await Student.findOne({
            where: {
                email,
            },
            include: [
                {
                    model: Parent,
                    as: 'ParentData',
                    attributes: ['id', 'fullName', 'association_for_student'],
                    include: [
                        {
                            model: AllCode,
                            as: 'AssociationData',
                            attributes: ['type', 'title', 'code'],
                        },
                    ],
                },
            ],
            raw: true,
            nest: true,
        })) as studentDto | null;

        if (student) {
            isValid = true;
        }

        return type !== 'check'
            ? {
                  Student: student,
                  isValid: isValid,
              }
            : isValid;
    }

    // REGISTER

    async createStudentService(data: studentDto) {
        try {
            let checkExit = await this.checkStudentExit(data.email);
            const saleCrete: any = await User.findOne({
                where: {
                    email: data.token_author,
                },
            });

            let idSale = -1;
            if (saleCrete) {
                idSale = saleCrete.id;
            }

            if (checkExit) {
                return ResponseHandler(httpStatus.BAD_REQUEST, null, 'Student already exists');
            }

            const passwordHash = await endCodePassword(data.password);

            await Student.create({
                ...data,
                password: passwordHash,
                sale_created_id: idSale,
            });

            const student: any = await Student.findOne({
                where: {
                    email: data.email,
                },
            });

            try {
                await Log.create({
                    student_id: student.id,
                    user_id: idSale,
                    event: 'Tài Khoản Đã Được Tạo Mới Bởi SALE',
                    description: '',
                    calendar_id: null,
                });
            } catch (error) {
                console.log(error);
            }

            return ResponseHandler(httpStatus.OK, student, 'Register Student Successfully');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    async CreateStudentBulk(data: studentDto[]) {
        try {
            const dataNew = await Promise.all(
                await data.map(async (user) => {
                    return {
                        ...user,
                        password: await endCodePassword(user.password),
                    };
                }),
            );

            await Student.bulkCreate(
                dataNew.map((item) => {
                    return {
                        ...item,
                    };
                }),
            );

            return ResponseHandler(httpStatus.OK, {}, 'Register Student Successfully');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    // LOGIN

    async loginStudentService(data: loginDto) {
        try {
            const dataCheck = await this.checkStudentExit(data.email, 'query');

            if (typeof dataCheck !== 'object')
                return Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
            if (!dataCheck.Student) {
                return Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
            }

            if (!dataCheck.isValid) {
                return ResponseHandler(httpStatus.BAD_REQUEST, null, 'User not exists');
            }

            const checkPassword = await comparePassword(data.password, dataCheck.Student.password);

            if (!checkPassword) {
                return ResponseHandler(httpStatus.BAD_REQUEST, null, 'Wrong password');
            }

            const user = {
                ...dataCheck.Student,
            } as any;

            delete user.password;

            const tokenAccess = handleCreateToken(
                {
                    id: dataCheck.Student.id,
                    email: dataCheck.Student.email,
                    phoneNumber: dataCheck.Student.phoneNumber,
                    is_login_social: false,
                    role: 1,
                    role_detail: 'USER',
                },
                '30day',
            );

            const tokenRefresh = handleCreateToken(
                {
                    id: dataCheck.Student.id,
                    email: dataCheck.Student.email,
                    phoneNumber: dataCheck.Student.phoneNumber,
                    is_login_social: false,
                    role: 1,
                    role_detail: 'USER',
                },
                '360day',
            );

            return ResponseHandler(
                httpStatus.OK,
                {
                    user: user,
                    tokens: {
                        access_token: tokenAccess,
                        refresh_token: tokenRefresh,
                    },
                },
                'User login successfully',
            );
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    // UPDATE Profile

    async updateStudentService(data: studentDto) {
        try {
            let student = await this.checkStudentExit(data.email, 'query');

            if (typeof student !== 'object')
                return Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
            if (!student.Student) {
                return Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
            }

            if (student.Student.avatar && data.avatar && !handleRemoveFile(student.Student.avatar, 'studentAvatar')) {
                return ResponseHandler(httpStatus.BAD_REQUEST, null, "Can't remove avatar old");
            }

            await Student.update(
                {
                    ...data,
                    password: student.Student.password,
                },
                {
                    where: { id: data.id },
                },
            );

            try {
                await Log.create({
                    student_id: student.Student.id,
                    user_id: null,
                    event: 'Tài khoản đã được cập nhật bởi SALE',
                    description: '',
                    calendar_id: null,
                });
            } catch (error) {
                console.log(error);
            }

            return ResponseHandler(httpStatus.OK, null, 'Thay đổi thông tin học sinh thành công');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    async handleGetAllStudent(
        page: number = 1,
        pageSize: number = 10,
        course_code = 'ALL',
        filter: string = 'all',
        level: number = 0,
        textSearch: string = '',
        idSale: string = '',
    ) {
        try {
            let resData;
            if (!page || !pageSize) {
                resData = await Student.findAll({
                    attributes: {
                        exclude: ['password'],
                    },
                });
            }

            const query: any = {};

            if (textSearch) {
                query[Op.or] = [
                    { fullName: { [Op.like]: `%${textSearch}%` } },
                    { phoneNumber: { [Op.like]: `%${textSearch}%` } },
                    { email: { [Op.like]: `%${textSearch}%` } },
                ];
            }

            if (idSale) {
                query.sale_created_id = +idSale;
            }

            if (course_code === 'ENG') {
                query.course_code = 'ENG';
            }

            if (course_code === 'MATH') {
                query.course_code = 'MATH';
            }

            if (level) {
                query.level = level;
            }

            if (filter === 'all') {
                let offset: number = (page - 1) * pageSize;
                let { count, rows } = await Student.findAndCountAll({
                    where: {
                        ...query,
                    },
                    // attributes: {
                    //     exclude: ['password'],
                    // },
                    include: [
                        {
                            model: Parent,
                            as: 'ParentData',
                            include: [{ model: AllCode, as: 'AssociationData' }],
                        },
                        {
                            model: User,
                            as: 'SaleData',
                            attributes: {
                                exclude: ['password'],
                            },
                        },
                    ],
                    offset: +offset,
                    limit: +pageSize,
                    // nest: true,
                    // raw: true,
                });

                const dataRes = await Promise.all(
                    await rows.map(async (row: any) => {
                        const dataCalendar = await CalendarTeacher.findOne({
                            order: [['time_stamp_start', 'DESC']],
                            where: {
                                student_id: row.id,
                            },
                            limit: 1,
                        });
                        const dataExam = await Exam.findAll({
                            order: [['createdAt', 'DESC']],
                            where: {
                                student_id: row.id,
                            },
                        });

                        row.calendar = dataCalendar ? dataCalendar : null;
                        row.exam = dataExam ? dataExam : [];
                        return row;
                    }),
                );

                resData = {
                    items: dataRes,
                    meta: {
                        currentPage: page,
                        totalIteams: count,
                        totalPages: Math.ceil(count / pageSize),
                    },
                };
                return ResponseHandler(httpStatus.OK, resData, ' course successfully 11');
            }

            if (filter === 'reservation') {
                let offset: number = (page - 1) * pageSize;
                let { count, rows }: { count: number; rows: any } = await CalendarTeacher.findAndCountAll({
                    where: {
                        student_id: {
                            [Op.ne]: null,
                        },
                        is_reservation: true,
                    },
                    include: [
                        {
                            model: Student,
                            as: 'studentData',
                            attributes: {
                                exclude: [
                                    // 'password',
                                    'createdAt',
                                    'updatedAt',
                                ],
                            },
                            include: [
                                {
                                    model: Exam,
                                    as: 'examData',
                                },
                            ],
                        },
                    ],
                    offset: +offset,
                    limit: +pageSize,
                    nest: true,
                });

                resData = {
                    items: rows.map((item: any) => item.studentData),
                    meta: {
                        currentPage: page,
                        totalIteams: count,
                        totalPages: Math.ceil(count / pageSize),
                    },
                };
                return ResponseHandler(httpStatus.OK, resData, ' course successfully 11');
            }

            if (filter === 'confirm') {
                let offset: number = (page - 1) * pageSize;
                let { count, rows }: { count: number; rows: any } = await CalendarTeacher.findAndCountAll({
                    where: {
                        student_id: {
                            [Op.ne]: null,
                        },
                        is_confirm: true,
                    },
                    include: [
                        {
                            model: Student,
                            as: 'studentData',
                            attributes: {
                                exclude: [
                                    // 'password',
                                    'createdAt',
                                    'updatedAt',
                                ],
                            },
                            include: [
                                {
                                    model: Exam,
                                    as: 'examData',
                                },
                            ],
                        },
                    ],
                    offset: +offset,
                    limit: +pageSize,
                    nest: true,
                });

                resData = {
                    items: rows.map((item: any) => item.studentData),
                    meta: {
                        currentPage: page,
                        totalIteams: count,
                        totalPages: Math.ceil(count / pageSize),
                    },
                };
                return ResponseHandler(httpStatus.OK, resData, ' course successfully 11');
            }

            if (filter === 'interviewed_meet') {
                let offset: number = (page - 1) * pageSize;
                let { count, rows }: { count: number; rows: any } = await CalendarTeacher.findAndCountAll({
                    where: {
                        student_id: {
                            [Op.ne]: null,
                        },
                        is_interviewed_meet: true,
                    },
                    include: [
                        {
                            model: Student,
                            as: 'studentData',
                            attributes: {
                                exclude: [
                                    // 'password',
                                    'createdAt',
                                    'updatedAt',
                                ],
                            },
                            include: [
                                {
                                    model: Exam,
                                    as: 'examData',
                                },
                            ],
                        },
                    ],
                    offset: +offset,
                    limit: +pageSize,
                    nest: true,
                });

                resData = {
                    items: rows.map((item: any) => item.studentData),
                    meta: {
                        currentPage: page,
                        totalIteams: count,
                        totalPages: Math.ceil(count / pageSize),
                    },
                };
                return ResponseHandler(httpStatus.OK, resData, ' course successfully 11');
            }

            if (filter === 'cancel') {
                let offset: number = (page - 1) * pageSize;
                let { count, rows }: { count: number; rows: any } = await CalendarTeacher.findAndCountAll({
                    where: {
                        student_id: {
                            [Op.ne]: null,
                        },
                        is_cancel: true,
                    },
                    include: [
                        {
                            model: Student,
                            as: 'studentData',
                            attributes: {
                                exclude: [
                                    // 'password',
                                    'createdAt',
                                    'updatedAt',
                                ],
                            },
                            include: [
                                {
                                    model: Exam,
                                    as: 'examData',
                                },
                            ],
                        },
                    ],
                    offset: +offset,
                    limit: +pageSize,
                    nest: true,
                });

                resData = {
                    items: rows.map((item: any) => item.studentData),
                    meta: {
                        currentPage: page,
                        totalIteams: count,
                        totalPages: Math.ceil(count / pageSize),
                    },
                };
                return ResponseHandler(httpStatus.OK, resData, ' course successfully 11');
            }

            if (filter === 'booked') {
                let offset: number = (page - 1) * pageSize;
                let { count, rows }: { count: number; rows: any } = await Exam.findAndCountAll({
                    where: {
                        student_id: {
                            [Op.ne]: null,
                        },
                        is_booked: true,
                    },
                    include: [
                        {
                            model: Student,
                            as: 'studentData',
                            attributes: {
                                exclude: [
                                    // 'password',
                                    'createdAt',
                                    'updatedAt',
                                ],
                            },
                            include: [
                                {
                                    model: Exam,
                                    as: 'examData',
                                },
                            ],
                        },
                    ],
                    offset: +offset,
                    limit: +pageSize,
                    nest: true,
                });

                resData = {
                    items: rows.map((item: any) => item.studentData),
                    meta: {
                        currentPage: page,
                        totalIteams: count,
                        totalPages: Math.ceil(count / pageSize),
                    },
                };
                return ResponseHandler(httpStatus.OK, resData, ' course successfully 11');
            }

            if (filter === 'testing') {
                let offset: number = (page - 1) * pageSize;
                let { count, rows }: { count: number; rows: any } = await Exam.findAndCountAll({
                    where: {
                        student_id: {
                            [Op.ne]: null,
                        },
                        is_testing: true,
                    },
                    include: [
                        {
                            model: Student,
                            as: 'studentData',
                            attributes: {
                                exclude: [
                                    // 'password',
                                    'createdAt',
                                    'updatedAt',
                                ],
                            },
                            include: [
                                {
                                    model: Exam,
                                    as: 'examData',
                                },
                            ],
                        },
                    ],
                    offset: +offset,
                    limit: +pageSize,
                    nest: true,
                });

                resData = {
                    items: rows.map((item: any) => item.studentData),
                    meta: {
                        currentPage: page,
                        totalIteams: count,
                        totalPages: Math.ceil(count / pageSize),
                    },
                };
                return ResponseHandler(httpStatus.OK, resData, ' course successfully 11');
            }

            if (filter === 'completed') {
                let offset: number = (page - 1) * pageSize;
                let { count, rows }: { count: number; rows: any } = await Exam.findAndCountAll({
                    where: {
                        student_id: {
                            [Op.ne]: null,
                        },
                        is_completed: true,
                    },
                    include: [
                        {
                            model: Student,
                            as: 'studentData',
                            attributes: {
                                exclude: [
                                    // 'password',
                                    'createdAt',
                                    'updatedAt',
                                ],
                            },
                            include: [
                                {
                                    model: Exam,
                                    as: 'examData',
                                },
                            ],
                        },
                    ],
                    offset: +offset,
                    limit: +pageSize,
                    nest: true,
                });

                resData = {
                    items: rows.map((item: any) => item.studentData),
                    meta: {
                        currentPage: page,
                        totalIteams: count,
                        totalPages: Math.ceil(count / pageSize),
                    },
                };
                return ResponseHandler(httpStatus.OK, resData, ' course successfully 11');
            }

            if (filter === 'result') {
                let offset: number = (page - 1) * pageSize;
                let { count, rows }: { count: number; rows: any } = await Exam.findAndCountAll({
                    where: {
                        student_id: {
                            [Op.ne]: null,
                        },
                        correct_result_count: {
                            [Op.ne]: null,
                        },
                    },
                    include: [
                        {
                            model: Student,
                            as: 'studentData',
                            attributes: {
                                exclude: [
                                    // 'password',
                                    'createdAt',
                                    'updatedAt',
                                ],
                            },
                            include: [
                                {
                                    model: Exam,
                                    as: 'examData',
                                },
                            ],
                        },
                    ],
                    offset: +offset,
                    limit: +pageSize,
                    nest: true,
                });

                resData = {
                    items: rows.map((item: any) => item.studentData),
                    meta: {
                        currentPage: page,
                        totalIteams: count,
                        totalPages: Math.ceil(count / pageSize),
                    },
                };
                return ResponseHandler(httpStatus.OK, resData, ' course successfully 11');
            }
        } catch (error) {
            console.log(error);
        }
    }

    async handleGetCountStudent(type: string, idStudent: string) {
        if (type === 'all') {
            return await Student.count();
        } else if (type === 'ENG' || type === 'MATH') {
            return await Student.count({
                where: {
                    course_code: type,
                },
            });
        }

        const query: { student_id: any } = {
            student_id: {
                [Op.ne]: null,
            },
        };

        if (idStudent) {
            query.student_id = idStudent;
        }

        if (type === 'meet') {
            const dataBuild = {
                reservation: 0,
                confirm: 0,
                interviewed_meet: 0,
                fail: 0,
                cancel: 0,
                completed: 0,
            };

            const dataQuery: any = await CalendarTeacher.findAll({
                where: {
                    ...query,
                },
                raw: true,
            });
            const dataCompleteCalendar = await CalendarTeacher.findAll({
                where: {
                    ...query,
                    link_video: {
                        [Op.ne]: null,
                    },
                    note: {
                        [Op.ne]: null,
                    },
                },
                include: [{ model: Student, as: 'studentData' }],
                nest: true,
            });

            dataBuild.completed = dataCompleteCalendar.filter((c: any) => c?.studentData?.level).length;

            const timeStamp = new Date().getTime();
            dataBuild.fail = dataQuery.filter((item: any) => {
                const timeStart = new Date(+item.time_stamp_start).getTime();
                if (timeStamp - timeStart > 0 && item.is_confirm === true) {
                    return true;
                }
            }).length;

            dataBuild.cancel = dataQuery.filter((item: any) => item.is_cancel).length;
            dataBuild.reservation = dataQuery.filter((item: any) => item.is_reservation).length;
            dataBuild.confirm = dataQuery.filter((item: any) => item.is_confirm).length;
            dataBuild.interviewed_meet = dataQuery.filter((item: any) => item.is_interviewed_meet).length;

            return dataBuild;
        }

        if (type === 'other') {
            const dataBuild = {
                is_booked: 0,
                is_testing: 0,
                is_completed: 0,
                is_tested: 0,
            };

            const dataQuery: any = await Exam.findAll({
                where: {
                    ...query,
                },
                raw: true,
            });

            dataBuild.is_booked = dataQuery.filter((item: any) => item.is_booked).length;
            dataBuild.is_testing = dataQuery.filter((item: any) => item.is_testing).length;
            dataBuild.is_tested = dataQuery.filter((item: any) => item.is_tested).length;
            dataBuild.is_completed = dataQuery.filter((item: any) => item.is_completed).length;

            return dataBuild;
        }
    }

    async getInfoStudentService(email: string) {
        try {
            let student = await this.checkStudentExit(email, 'query');

            if (typeof student !== 'object')
                return Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
            if (!student.Student) {
                return Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, "Student doesn't exits !"));
            }

            return ResponseHandler(httpStatus.OK, student.Student, 'Info Student ');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    async updateLevelService(id: number, level: number) {
        try {
            if (!id || !level) {
                return Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
            }

            const exam: any = await Exam.findOne({
                where: {
                    student_id: +id,
                    is_tested: true,
                },
                order: [['updatedAt', 'DESC']],
                raw: true,
                nest: true,
            });

            if (exam) {
                await Student.update(
                    {
                        level: level,
                    },
                    {
                        where: { id: id },
                    },
                );
                return ResponseHandler(httpStatus.OK, null, 'Cập nhật level thành công ');
            } else {
                return ResponseHandler(
                    httpStatus.BAD_REQUEST,
                    null,
                    'Hãy đảm bảo rằng học sinh đã làm kiểm tra và bạn đã xem qua nó!',
                );
            }
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }
    async handleGetOneStudent(id: number) {
        try {
            const student: any = await Student.findOne({
                where: { id: id },
                attributes: {
                    exclude: ['password'],
                },
            });
            const calendar = await CalendarTeacher.findAll({
                where: {
                    student_id: id,
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
                ],
            });

            const exam = await Exam.findAll({
                where: {
                    student_id: id,
                },
            });

            return ResponseHandler(
                httpStatus.OK,
                {
                    student,
                    exam,
                    calendar,
                },
                'Info Student ',
            );
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }
    // async getStudentMathService(teacherId: number, page: number, pageSize: number) {
    //     try {
    //         if (!teacherId || !page || !pageSize) {
    //             return Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'Cần nhập đủ thông tin'));
    //         }

    async searchStudentService(textSearch: string, page: number, pageSize: number) {
        try {
            let offset: number = (page - 1) * pageSize;

            let { count, rows } = await Exam.findAndCountAll({
                where: {
                    [Op.or]: [
                        { fullName: { [Op.like]: `%${textSearch}%` } },
                        { phoneNumber: { [Op.like]: `%${textSearch}%` } },
                        { email: { [Op.like]: `%${textSearch}%` } },
                    ],
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt'],
                },
                include: [
                    {
                        model: Exam,
                        as: 'examData',
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
                                            exclude: ['createdAt', 'updatedAt', 'level', 'author_id'],
                                        },
                                        include: [
                                            {
                                                model: Answer,
                                                as: 'answers',
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
                offset: offset,
                limit: pageSize,
            });

            let resData = {
                items: rows,
                meta: {
                    currentPage: page,
                    totalIteams: count,
                    totalPages: Math.ceil(count / pageSize),
                },
            };
            return ResponseHandler(httpStatus.OK, resData, 'Info Student ');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    async handleInterView(id: string, Res: Response) {
        try {
            const checkCalendarValid: any = await CalendarTeacher.findOne({
                where: {
                    student_id: +id,
                    link_video: {
                        [Op.ne]: null,
                    },
                    note: {
                        [Op.ne]: null,
                    },
                },
                raw: true,
                nest: true,
            });
            const checkUserValid: any = await Student.findOne({
                where: {
                    id: +id,
                    level: {
                        [Op.ne]: null,
                    },
                },
                raw: true,
                nest: true,
            });
            const exam: any = await Exam.findOne({
                where: {
                    student_id: +id,
                    is_tested: true,
                },
                order: [['updatedAt', 'DESC']],
                raw: true,
                nest: true,
            });

            let path = '';
            if (checkCalendarValid && checkUserValid && exam) {
                const level: any = await AllCode.findOne({
                    where: {
                        id: checkUserValid.level,
                    },
                    raw: true,
                    nest: true,
                });
                path = `${process.env.FRONT_END_URL}/interview?studentId=${id}&level=${level.code ? level.code : 'EMPTY'}&level_detail=${level.title}&timeStart=${exam.updatedAt ? new Date(exam.updatedAt).toLocaleDateString() : new Date().toLocaleDateString()}`;
            } else {
                path = `${process.env.FRONT_END_URL}/interview?studentId=${id}&isLevel=EMPTY`;
            }
            return path;
        } catch (error) {
            return `${process.env.FRONT_END_URL}/interview?studentId=${id}&isLevel=EMPTY`;
        }
    }

    async deleteStudentService(id: number) {
        try {
            if (!id) {
                return ResponseHandler(httpStatus.BAD_REQUEST, null, 'Please enter id student');
            }

            let listExam = (await Exam.findAll({
                where: { student_id: id },
                raw: true,
                nest: true,
            })) as Partial<examDto>[];

            const examIds = listExam.map((item) => item.id);

            let listCalendar = (await CalendarTeacher.findAll({
                where: { student_id: id },
            })) as Partial<createCalendarDto>[];

            const listCalendarIds = listCalendar.map((item) => item.id);

            await Promise.all([
                ExamQuestion.destroy({
                    where: {
                        exam_id: examIds,
                    },
                }),
                Log.destroy({
                    where: {
                        calendar_id: listCalendarIds,
                    },
                }),
            ]);

            const [deletedCalendarTeachers, deletedExams, deletedParents] = await Promise.all([
                CalendarTeacher.destroy({
                    where: { student_id: id },
                }),
                Exam.destroy({
                    where: { student_id: id },
                }),
                Parent.destroy({
                    where: { child: id },
                }),
                Log.destroy({
                    where: { student_id: id },
                }),
            ]);

            await Student.destroy({
                where: { id: id },
            });

            return ResponseHandler(httpStatus.OK, null, 'Xóa học sinh thành công ');
        } catch (error) {
            console.log(error);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }
}

export default new studentService();
