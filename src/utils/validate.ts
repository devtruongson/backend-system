import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Response } from 'express';
import httpStatus from 'http-status';

export const validateData = async (dto: any, data: any, res: Response): Promise<boolean> => {
    let isValid = true;
    const dtoData = plainToClass(dto, data);
    const errors = await validate(dtoData);
    if (errors.length > 0) {
        isValid = false;
        res.status(httpStatus.BAD_REQUEST).json({ errors: errors.map((error) => error.constraints) });
    }
    return isValid;
};
