import httpStatus from 'http-status';
import Sequelize from 'sequelize';
import { examQuestionDto } from '~/dto/createExamQuestion';
import ExamQuestion from '~/models/ExamQuestion';
import Question from '~/models/Question';
import { ResponseHandler } from '~/utils/Response';

class examQuestionService {
    async handleCheckExit(examId: number, questionId: number): Promise<boolean> {
        let data = (await ExamQuestion.findOne({
            where: {
                exam_id: examId,
                question_id: questionId,
            },
        })) as examQuestionDto | null;
        if (data) {
            return true;
        }
        return false;
    }

    async handleGetRandomQuestion(level: number, count: number = 5, classId: number, course: string): Promise<any> {
        const model: any = Question;

        const query: any = {};

        if (+classId !== -1) {
            query.class = classId;
        }

        let questions = await model.findAll({
            where: {
                level: level,
                ...query,
                course_code: course,
            },
            order: [[Sequelize.literal('RAND()')]],
            limit: count,
            attributes: ['id'],
            raw: true,
        });
        return questions;
    }

    // CREATE

    async createExamQuestionService(listData: any) {
        try {
            await listData.map(async (item: examQuestionDto) => {
                if (await this.handleCheckExit(item.exam_id, item.question_id)) {
                    return ResponseHandler(httpStatus.BAD_REQUEST, null, 'Question Already Exists In The Exam');
                }
            });

            await ExamQuestion.bulkCreate(listData, {
                fields: ['exam_id', 'question_id', 'is_right'],
            });
            return ResponseHandler(httpStatus.OK, null, 'Create Exam-Question Successfully');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    // CREATE AUTO

    async createExamQuestionAutoService(
        examId: number,
        totalQuestion: number,
        level: number,
        classId: number,
        course: string,
    ) {
        try {
            let listQuestion = (await this.handleGetRandomQuestion(level, totalQuestion, classId, course)) as {
                id: number;
            }[];

            await ExamQuestion.bulkCreate(
                listQuestion.map((item) => {
                    return {
                        exam_id: examId,
                        question_id: item.id,
                        is_right: false,
                        selected_answer: null,
                    };
                }),
            );

            return ResponseHandler(httpStatus.OK, null, 'Create Auto Exam-Question Successfully');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    //DELETE

    async deleteExamQuestionService(id: number) {
        try {
            await ExamQuestion.destroy({
                where: { id: id },
            });
            return ResponseHandler(httpStatus.OK, null, 'Delete Exam-Question Successfully');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    //UPDATE

    async updateExamQuestionService() {
        try {
            return ResponseHandler(httpStatus.OK, null, '');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }
}

export default new examQuestionService();
