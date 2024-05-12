import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { createAllCodeDTO } from '~/dto/creayeAllCode.dto';
import allCodeService from '~/service/allCodeService';
import { ResponseHandler } from '~/utils/Response';
import { validateData } from '~/utils/validate';

class allCodeController {
    async createAllCode(req: Request, res: Response) {
        try {
            await validateData(createAllCodeDTO, req.body, res);
            const data = await allCodeService.createAllCode(req.body);
            return res.status(httpStatus.OK).json(data);
        } catch (error) {
            console.log(error);
            return res.status(500).json(ResponseHandler(httpStatus.BAD_GATEWAY, null, 'Error From Server'));
        }
    }
}

export default new allCodeController();