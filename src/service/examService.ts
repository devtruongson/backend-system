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
    //
    // CREATE

    async createExamService(data: examDto) {
        try {
            await Exam.create({
                ...data,
                correct_result_count: 0,
                total_result: 0,
            });
            return ResponseHandler(httpStatus.OK, null, 'Create Exam Successfully');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    // GET

    async getExamService(id: number, page: number | undefined, pageSize: number | undefined, type: string) {
        try {
            if (!page || !pageSize) {
                let data =
                    type === 'student'
                        ? await Exam.findAll({
                              where: { student_id: id },
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
                                          },
                                      ],
                                  },
                              ],
                          })
                        : type === 'teacher'
                          ? await Exam.findAll({
                                where: { teacher_id: id },
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
                                            },
                                        ],
                                    },
                                ],
                            })
                          : await Exam.findAll({
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
                                            },
                                        ],
                                    },
                                ],
                            });

                return ResponseHandler(httpStatus.OK, data, 'All Exam');
            }

            let offset: number = (page - 1) * pageSize;

            let { count, rows } =
                type === 'student'
                    ? await Exam.findAndCountAll({
                          where: { student_id: id },
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
                                      },
                                  ],
                              },
                          ],
                          offset: offset,
                          limit: pageSize,
                      })
                    : type === 'teacher'
                      ? await Exam.findAndCountAll({
                            where: { teacher_id: id },
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
                                        },
                                    ],
                                },
                            ],
                            offset: offset,
                            limit: pageSize,
                        })
                      : await Exam.findAndCountAll({
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

            let exam = (await Exam.findOne({
                where: { id: examId },
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

                                include: [{ model: Answer, as: 'answers' }],
                            },
                        ],
                    },
                ],
            })) as Exam;

            if (!exam) {
                return ResponseHandler(httpStatus.NOT_FOUND, null, ' Exam not exits');
            }

            await Promise.all(
                exam.dataValues.ExamQuestionData.map(async (item: examQuestionDto) => {
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
                    total_result: countSuccess * (10 / exam.dataValues.total_question),
                },
                {
                    where: { id: examId },
                },
            );

            return ResponseHandler(httpStatus.OK, exam, '');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }
}

export default new examService();
