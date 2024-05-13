import httpStatus from 'http-status';
import { answerDto } from '~/dto/createAnswer.dto';
import Answer from '~/models/Answer';
import { ResponseHandler } from '~/utils/Response';

class answerService {
    async createAnswerService(data: any) {
        try {
            await Answer.bulkCreate(data, {
                fields: ['answer_title', 'is_right', 'question_id'],
            });

            return ResponseHandler(httpStatus.OK, null, 'Create Answer Successfully');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    async deleteAnswerService(id: number) {
        try {
            await Answer.destroy({
                where: { id: id },
            });

            return ResponseHandler(httpStatus.OK, null, 'Delete Answer Successfully');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    async getAnswerService(questionId: number) {
        try {
            let answers = await Answer.findAll({
                where: { question_id: questionId },
            });

            return ResponseHandler(httpStatus.OK, answers, 'all Answer');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    async updateAnswerService(data: answerDto) {
        try {
            await Answer.update(
                { ...data },
                {
                    where: { id: data.id },
                },
            );

            return ResponseHandler(httpStatus.OK, null, 'update answer successfully');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }
}

export default new answerService();
