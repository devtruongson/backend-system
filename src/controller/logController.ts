import { Request, Response } from 'express';
import httpStatus from 'http-status';
import logService from '~/service/logService';
import { ResponseHandler } from '~/utils/Response';

class logController {
    async getAllLog(req: Request, res: Response) {
        try {
            const data = await logService.getAllLog(req.query.idStudent as any);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
        }
    }
}

export default new logController();
