import httpStatus from 'http-status';
import { where } from 'sequelize';
import { examDto } from '~/dto/createExam.dto';
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
                                      include: [{ model: Question, as: 'QuestionData' }],
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
                                        include: [{ model: Question, as: 'QuestionData' }],
                                    },
                                ],
                            })
                          : await Exam.findAll({
                                include: [
                                    {
                                        model: ExamQuestion,
                                        as: 'ExamQuestionData',
                                        include: [{ model: Question, as: 'QuestionData' }],
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
                                  include: [{ model: Question, as: 'QuestionData' }],
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
                                    include: [{ model: Question, as: 'QuestionData' }],
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
                                    include: [{ model: Question, as: 'QuestionData' }],
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

    async updateScoreExamService(data: examDto) {
        try {
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }
}

export default new examService();
