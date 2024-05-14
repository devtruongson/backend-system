import httpStatus from 'http-status';
import { questionDto } from '~/dto/createQuestion.dto';
import { handleRemoveFile } from '~/helpers/handleRemoveImg';
import AllCode from '~/models/AllCode';
import Answer from '~/models/Answer';
import Question from '~/models/Question';
import User from '~/models/User';
import { ResponseHandler } from '~/utils/Response';

class questionService {
    async getOneQuestion(id: number): Promise<questionDto | null> {
        let question = (await Question.findOne({ where: { id: id } })) as questionDto | null;
        return question;
    }

    // CREATE

    async createQuestionService(data: questionDto) {
        try {
            await Question.create({
                ...data,
            });

            return ResponseHandler(httpStatus.OK, null, 'Create Question successfully');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    // GET ALL

    async getAllQuestionService() {
        try {
            let questions = await Question.findAll({
                include: [
                    {
                        model: Answer,
                        as: 'answers',
                        attributes: ['id', 'answer_title', 'is_right'],
                    },
                    {
                        model: AllCode,
                        as: 'levelData',
                        attributes: ['id', 'type', 'title', 'code'],
                    },
                ],
            });
            return ResponseHandler(httpStatus.OK, questions, ' All Question');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    // GET LIMIT

    async getQuestionService(page: number, pageSize: number, authorId: number) {
        try {
            let offset: number = (page - 1) * pageSize;
            let { count, rows } = await Question.findAndCountAll({
                where: { author_id: authorId },
                include: [
                    {
                        model: AllCode,
                        as: 'levelData',
                        attributes: ['id', 'type', 'title', 'code'],
                    },
                    {
                        model: Answer,
                        as: 'answers',
                        attributes: ['id', 'answer_title', 'is_right'],
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
            return ResponseHandler(httpStatus.OK, resData, 'Questions');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    //DELETE

    async deleteQuestionService(id: number) {
        try {
            let question = (await this.getOneQuestion(id)) as questionDto;

            if (!question) {
                return ResponseHandler(httpStatus.BAD_REQUEST, null, "can't find question");
            }

            if (question.file && !handleRemoveFile(question.file, 'questionFile')) {
                return ResponseHandler(httpStatus.BAD_REQUEST, null, "can't remove thumbnail");
            }

            await Question.destroy({
                where: { id: id },
            });

            return ResponseHandler(httpStatus.OK, null, 'Delete Question successfully');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }

    //UPDATE

    async updateQuestionService(data: questionDto) {
        try {
            if (data.isChangeFile && data.fileOld && !handleRemoveFile(data.fileOld, 'questionFile')) {
                return ResponseHandler(httpStatus.BAD_REQUEST, null, "can't remove thumbnail");
            }

            await Question.update(
                {
                    ...data,
                },
                {
                    where: { id: data.id },
                },
            );
            return ResponseHandler(httpStatus.OK, null, 'Update Question successfully');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }
}

export default new questionService();
