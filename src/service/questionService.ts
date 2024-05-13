import httpStatus from 'http-status';
import Question from '~/models/Question';
import { ResponseHandler } from '~/utils/Response';

class questionService {
    async createQuestionService() {
        try {
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }
}

export default new questionService();
