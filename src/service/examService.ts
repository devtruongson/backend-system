import httpStatus from 'http-status';
import { answerDto } from '~/dto/createAnswer.dto';
import { examDto } from '~/dto/createExam.dto';
import { examQuestionDto } from '~/dto/createExamQuestion';
import Answer from '~/models/Answer';
import Exam from '~/models/Exam';
import ExamQuestion from '~/models/ExamQuestion';
import Question from '~/models/Question';
import { ResponseHandler } from '~/utils/Response';
import examQuestionService from './examQuestionService';
import Student from '~/models/Student';
import Log from '~/models/Log';

class examService {
    async handleGetOneExam(
        id: number,
        isCompleted: boolean = false,
    ): Promise<Omit<examDto, 'course_code' | 'class'> | null> {
        let excludeAnswer = ['createdAt', 'updatedAt'];
        if (!isCompleted) {
            excludeAnswer.push('is_right');
        }
        let exam = (await Exam.findOne({
            where: { id: id },
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
                                    attributes: {
                                        exclude: [...excludeAnswer],
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
            nest: true,
        })) as Omit<examDto, 'course_code' | 'class'> | null;

        return exam;
    }

    // CREATE

    async createExamService(data: examDto) {
        try {
            const examCreate: any = await Exam.create({
                ...data,
                teacher_id: null,
                correct_result_count: 0,
                total_result: 0,
                is_completed: false,
                is_booked: true,
                is_testing: false,
                is_tested: false,
                level: null,
            });

            await Log.create({
                student_id: data.student_id,
                user_id: null,
                event: `${data.title} đã được tạo`,
                description: '',
                calendar_id: null,
            });

            const check = await examQuestionService.createExamQuestionAutoService(
                examCreate.id,
                +data.total_question,
                +data.level,
                +data.class,
                data.course_code,
            );

            const exam = (await Exam.findOne({
                where: {
                    code: data.code,
                },
                nest: true,
            })) as Omit<examDto, 'course_code' | 'class'> | null;

            if (!exam) {
                return ResponseHandler(httpStatus.BAD_REQUEST, null, 'Tạo lỗi vui lòng thử lại');
            }

            return ResponseHandler(httpStatus.OK, exam.id, 'Create Exam Successfully');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    // GET

    async getExamService(
        id: number,
        page: number | undefined,
        pageSize: number | undefined,
        type: string,
        isComplated: boolean,
    ) {
        try {
            let query: any = {
                is_completed: isComplated,
            };

            if (type === 'student') {
                query.student_id = id;
            } else if (type === 'teacher') {
                query.teacher_id = id;
            }

            if (!page || !pageSize) {
                let data = await Exam.findAll({
                    where: { ...query },
                    include: [
                        {
                            model: Student,
                            as: 'studentData',
                            attributes: {
                                exclude: ['password'],
                            },
                        },
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
                });

                return ResponseHandler(httpStatus.OK, data, 'All Exam');
            }

            let offset: number = (page - 1) * pageSize;

            const [count, rows] = await Promise.all([
                await Exam.count({
                    where: { ...query },
                }),
                await Exam.findAll({
                    where: { ...query },
                    include: [
                        {
                            model: Student,
                            as: 'studentData',
                            attributes: {
                                exclude: ['password'],
                            },
                        },
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
                    offset: offset,
                    limit: pageSize,
                }),
            ]);

            // let { count, rows } = await Exam.findAndCountAll({
            //     where: { ...query },
            //     include: [
            //         {
            //             model: ExamQuestion,
            //             as: 'ExamQuestionData',
            //             attributes: {
            //                 exclude: ['createdAt', 'updatedAt'],
            //             },
            //             include: [
            //                 {
            //                     model: Question,
            //                     as: 'QuestionData',
            //                     attributes: {
            //                         exclude: ['createdAt', 'updatedAt', 'level', 'author_id'],
            //                     },
            //                     include: [
            //                         {
            //                             model: Answer,
            //                             as: 'answers',
            //                         },
            //                     ],
            //                 },
            //             ],
            //         },
            //     ],
            //     offset: offset,
            //     limit: pageSize,
            // });

            let resData = {
                items: rows,
                meta: {
                    currentPage: page,
                    totalIteams: count,
                    totalPages: Math.ceil(count / pageSize),
                },
            };
            return ResponseHandler(httpStatus.OK, resData, 'exams');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    //DELETE

    async deleteExamService(id: number) {
        try {
            await ExamQuestion.destroy({
                where: {
                    exam_id: id,
                },
            });

            await Exam.destroy({
                where: { id: id },
            });
            return ResponseHandler(httpStatus.OK, null, 'Delete Exam Successfully');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    //UPDATE INFO

    async updateInfoExamService(data: Omit<examDto, 'course_code' | 'class'>) {
        try {
            await Exam.update(
                {
                    ...data,
                },
                { where: { id: data.id } },
            );
            return ResponseHandler(httpStatus.OK, null, 'Update Info Exam Successfully');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    // UPDATE SCORE EXAM

    async updateScoreExamService(listAnswer: number[], examId: number) {
        try {
            let countSuccess = 0;

            let exam = await this.handleGetOneExam(examId, true);

            if (!exam) {
                return ResponseHandler(httpStatus.NOT_FOUND, null, ' Exam not exits');
            }

            await Promise.all(
                exam.ExamQuestionData?.map(async (item: examQuestionDto) => {
                    await Promise.all(
                        item.QuestionData.answers.map(async (answer: answerDto) => {
                            if (listAnswer.includes(answer.id)) {
                                if (answer.is_right) {
                                    countSuccess = countSuccess + 1;
                                }
                                await ExamQuestion.update(
                                    {
                                        selected_answer: answer.id,
                                    },
                                    { where: { id: item.id } },
                                );
                            }
                        }),
                    );
                }),
            );

            const point = parseFloat((+countSuccess * (10 / +exam.total_question)).toFixed(2));

            await Exam.update(
                {
                    correct_result_count: countSuccess,
                    total_result: point,
                },
                {
                    where: { id: examId },
                },
            );

            await this.ChangeStatus('is_tested', `${examId}`);

            let data = {
                point: point,
            };

            return ResponseHandler(httpStatus.OK, data, '');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    async getOneExamService(id: number, isCompleted: boolean) {
        try {
            if (!id) {
                return ResponseHandler(httpStatus.NOT_FOUND, null, ' Exam id không được trống !');
            }

            let exam = await this.handleGetOneExam(id, isCompleted);

            return ResponseHandler(httpStatus.OK, exam, '');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    async handleGetExamDESC(studentId: number) {
        let data = await Exam.findAll({
            where: {
                student_id: studentId,
            },
            order: [['id', 'DESC']],
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
        });

        return ResponseHandler(httpStatus.OK, data, 'All Exam');
    }

    async ChangeStatus(status: string, id: string) {
        try {
            const statusChange = {
                is_booked: false,
                is_testing: false,
                is_tested: false,
                is_completed: false,
            };

            switch (status) {
                case 'is_booked':
                    statusChange.is_booked = true;
                    statusChange.is_testing = false;
                    statusChange.is_tested = false;
                    statusChange.is_completed = false;
                    break;
                case 'is_testing':
                    statusChange.is_booked = false;
                    statusChange.is_testing = true;
                    statusChange.is_tested = false;
                    statusChange.is_completed = false;
                    break;
                case 'is_tested':
                    statusChange.is_booked = false;
                    statusChange.is_testing = false;
                    statusChange.is_tested = true;
                    statusChange.is_completed = false;
                    break;
                case 'is_completed':
                    statusChange.is_booked = false;
                    statusChange.is_testing = false;
                    statusChange.is_tested = false;
                    statusChange.is_completed = true;
                    break;
            }

            await Exam.update(
                {
                    ...statusChange,
                },
                {
                    where: {
                        id: parseInt(id),
                    },
                },
            );
            return ResponseHandler(httpStatus.OK, null, 'exam updated successfully');
        } catch (error) {
            console.log(error);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    async changeLevelService(id: number, level: number) {
        try {
            if (!id || !level) {
                return ResponseHandler(httpStatus.BAD_REQUEST, null, 'miss value');
            }

            await Exam.update(
                {
                    level: level,
                    is_booked: false,
                    is_testing: false,
                    is_tested: false,
                    is_completed: true,
                },
                {
                    where: {
                        id: id,
                    },
                },
            );
            return ResponseHandler(httpStatus.OK, null, 'exam updated successfully');
        } catch (error) {
            console.log(error);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }
}

export default new examService();
