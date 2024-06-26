import { raw } from 'body-parser';
import httpStatus from 'http-status';
import { NIL } from 'uuid';
import { answerDto } from '~/dto/createAnswer.dto';
import { questionDto } from '~/dto/createQuestion.dto';
import { handleRemoveFile } from '~/helpers/handleRemoveImg';
import AllCode from '~/models/AllCode';
import Answer from '~/models/Answer';
import ExamQuestion from '~/models/ExamQuestion';
import Question from '~/models/Question';
import User from '~/models/User';
import { ResponseHandler } from '~/utils/Response';

interface ICreateBulk {
    questions: questionDto[];
    answers: Partial<answerDto>[][];
}

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

    async getQuestionService(
        page: number,
        pageSize: number,
        authorId: number,
        level: number = 0,
        classId: number,
        course: string,
    ) {
        try {
            let query: any = {
                author_id: authorId,
            };

            if (level) {
                query.level = level;
            }

            if (classId) {
                query.class = classId;
            }

            if (course) {
                query.course_code = course;
            }

            let offset: number = (page - 1) * pageSize;
            let { count, rows } = await Question.findAndCountAll({
                where: { ...query },
                order: [['id', 'DESC']],

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
                // raw: true,
                // nest: true,
            });

            let resData = {
                items: rows,
                meta: {
                    currentPage: page,
                    totalIteams: await Question.count(),
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

            // if (question.file && !handleRemoveFile(question.file, 'questionFile')) {
            //     return ResponseHandler(httpStatus.BAD_REQUEST, null, "can't remove thumbnail");
            // }

            await Promise.all([
                await ExamQuestion.destroy({
                    where: { question_id: id },
                }),
                await Answer.destroy({
                    where: { question_id: id },
                }),
            ]);

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

    async cretaeBul(data: ICreateBulk) {
        try {
            const createQuestions = (await Question.bulkCreate(
                data.questions.map((item) => {
                    return {
                        ...item,
                    };
                }),
            )) as Partial<questionDto>[];

            data.answers.forEach(async (item, index) => {
                await Answer.bulkCreate(
                    item.map((itemChild) => {
                        console.log(index);
                        return {
                            ...itemChild,
                            question_id: createQuestions[index].id,
                        };
                    }),
                );
            });
            return ResponseHandler(httpStatus.OK, null, 'Update Question successfully');
        } catch (err) {
            console.log(err);
            Promise.reject(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'có lỗi xảy ra!'));
        }
    }
}

export default new questionService();
