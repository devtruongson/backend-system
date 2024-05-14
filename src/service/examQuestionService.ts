import httpStatus from 'http-status';
import { examQuestionDto } from '~/dto/createExamQuestion';
import ExamQuestion from '~/models/ExamQuestion';
import { ResponseHandler } from '~/utils/Response';

class examQuestionService {
    //
    // CREATE

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
