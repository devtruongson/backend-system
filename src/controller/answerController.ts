import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { answerDto } from '~/dto/createAnswer.dto';
import answerService from '~/service/answerService';
import { ResponseHandler } from '~/utils/Response';
import { validateData } from '~/utils/validate';

class answerController {
    async handleCreateAnswer(req: Request, res: Response) {
        try {
        } catch (err) {
            console.log(err);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
        }
    }
}

export default new answerController();
