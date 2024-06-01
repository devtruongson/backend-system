import httpStatus from 'http-status';
import { answerDto } from '~/dto/createAnswer.dto';
import { examDto } from '~/dto/createExam.dto';
import { examQuestionDto } from '~/dto/createExamQuestion';
import Answer from '~/models/Answer';
import Exam from '~/models/Exam';
import ExamQuestion from '~/models/ExamQuestion';
import Question from '~/models/Question';
import { ResponseHandler } from '~/utils/Response';

class examService {
    async handleGetOneExam(id: number, isCompleted: boolean = false): Promise<examDto | null> {
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
        })) as examDto | null;

        return exam;
    }

    // CREATE

    async createExamService(data: examDto) {
        try {
            await Exam.create({
                ...data,
                correct_result_count: 0,
                total_result: 0,
                is_completed: false,
                is_booked: true,
                is_testing: false,
                is_tested: false,
            });

            return ResponseHandler(httpStatus.OK, null, 'Create Exam Successfully');
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

    async updateInfoExamService(data: examDto) {
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
                                        // is_right: answer.id
                                        selected_answer: answer.id,
                                    },
                                    { where: { id: item.id } },
                                );
                            }
                        }),
                    );
                }),
            );

            await Exam.update(
                {
                    correct_result_count: countSuccess,
                    total_result: countSuccess * (10 / exam.total_question),
                    is_completed: true,
                    is_tested: true,
                },
                {
                    where: { id: examId },
                },
            );

            let data = {
                point: countSuccess * (10 / exam.total_question),
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
}

export default new examService();
