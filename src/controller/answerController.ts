import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { answerDto } from '~/dto/createAnswer.dto';
import answerService from '~/service/answerService';
import { ResponseHandler } from '~/utils/Response';
import { validateData } from '~/utils/validate';

class answerController {
    // CREATE

    async handleCreateAnswer(req: Request, res: Response) {
        try {
            let listAnswer: answerDto[] = req.body;
            listAnswer.map((item: answerDto) => validateData(answerDto, item, res));

            let data = await answerService.createAnswerService(listAnswer);
            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            console.log(err);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
        }
    }

    // GET

    async handleGetAnswer(req: Request, res: Response) {
        try {
            let questionId = req.query?.questionId as number | undefined;

            if (!questionId) {
                return res
                    .status(httpStatus.NOT_FOUND)
                    .json(ResponseHandler(httpStatus.NOT_FOUND, null, "question id must't empty !"));
            }

            let data = await answerService.getAnswerService(questionId);
            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            console.log(err);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
        }
    }

    //DELETE

    async handleDeleteAnswer(req: Request, res: Response) {
        try {
            let id = +req.params.id;

            if (!id) {
                return res
                    .status(httpStatus.NOT_FOUND)
                    .json(ResponseHandler(httpStatus.NOT_FOUND, null, "id answer must't empty !"));
            }

            let data = await answerService.deleteAnswerService(id);
            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            console.log(err);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
        }
    }

    //UPDATE

    async handleUpdateAnswer(req: Request, res: Response) {
        try {
            await validateData(answerDto, req.body, res);
            let data = await answerService.updateAnswerService(req.body);
            return res.status(httpStatus.OK).json(data);
        } catch (err) {
            console.log(err);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
        }
    }
}

export default new answerController();
