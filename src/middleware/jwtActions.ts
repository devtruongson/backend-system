import jwt from 'jsonwebtoken';
import { IPayloadJWT } from '~/utils/interface';
import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import { role } from '~/utils/enum';
import { ResponseHandler } from '~/utils/Response';
import httpStatus from 'http-status';

dotenv.config();

export const handleCreateToken = (payload: IPayloadJWT, expire: string): string | null => {
    try {
        let key = process.env.JWT_SECRET as string;
        let token = jwt.sign(payload, key, {
            expiresIn: expire,
        });
        return token;
    } catch (err) {
        console.log(err);
        return null;
    }
};

export const handleVerifyToken = (token: string): IPayloadJWT | null => {
    try {
        let key: string = process.env.JWT_SECRET as string;
        return jwt.verify(token, key) as IPayloadJWT;
    } catch (err) {
        console.log(err);
        return null;
    }
};

// USER

export const handleCheckTokenUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.headers.authorization)
            return res
                .status(httpStatus.UNAUTHORIZED)
                .json(ResponseHandler(httpStatus.UNAUTHORIZED, null, 'token not found'));

        const token = req.headers.authorization?.replace('Bearer', '').trim();

        let decode = handleVerifyToken(token);

        if (!decode)
            return res
                .status(httpStatus.FORBIDDEN)
                .json(ResponseHandler(httpStatus.FORBIDDEN, null, "token can't decoded"));

        req.body.token_author = decode.email;

        if (decode.role_detail === role.USER || decode.role_detail === role.ADMIN) {
            next();
        } else {
            return res.status(403).json(ResponseHandler(httpStatus.FORBIDDEN, null, "your role aren't user"));
        }
    } catch (err) {
        console.log(err);
        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
    }
};

// SYSTEM
export const handleCheckTokenUserInSystem = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.headers.authorization)
            return res
                .status(httpStatus.UNAUTHORIZED)
                .json(ResponseHandler(httpStatus.UNAUTHORIZED, null, 'token not found'));

        const token = req.headers.authorization?.replace('Bearer', '').trim();

        let decode = handleVerifyToken(token);

        if (!decode)
            return res
                .status(httpStatus.FORBIDDEN)
                .json(ResponseHandler(httpStatus.FORBIDDEN, null, "token can't decoded"));

        req.body.token_author = decode.email;
        if (
            decode.role_detail === role.ADMIN ||
            decode.role_detail === role.SALE ||
            decode.role_detail === role.TEACHER ||
            decode.role_detail === role.USER
        ) {
            next();
        } else {
            return res.status(403).json(ResponseHandler(httpStatus.FORBIDDEN, null, "your role aren't user"));
        }
    } catch (err) {
        console.log(err);
        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
    }
};

// TEACHER

export const handleCheckTokenTeacher = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.headers.authorization)
            return res
                .status(httpStatus.UNAUTHORIZED)
                .json(ResponseHandler(httpStatus.UNAUTHORIZED, null, 'token not found'));

        const token = req.headers.authorization?.replace('Bearer', '').trim();

        let decode = handleVerifyToken(token);

        if (!decode)
            return res
                .status(httpStatus.FORBIDDEN)
                .json(ResponseHandler(httpStatus.FORBIDDEN, null, "token can't decoded"));

        req.body.token_author = decode.email;

        if (decode.role_detail === role.TEACHER || decode.role_detail === role.ADMIN) {
            next();
        } else {
            return res.status(403).json(ResponseHandler(httpStatus.FORBIDDEN, null, "your role aren't teacher"));
        }
    } catch (err) {
        console.log(err);
        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
    }
};

// const handleCheckToken = (token :string | undefined,res:Response)=>{
//     if (!token) return res.status(httpStatus.UNAUTHORIZED).json(ResponseHandler(httpStatus.UNAUTHORIZED,null,"token not found"));

//     const tokenSplit =  token?.replace("Bearer","").trim();

//     let decode = handleVerifyToken(token);

//     if(!decode) return res.status(httpStatus.FORBIDDEN).json(ResponseHandler(httpStatus.FORBIDDEN, null , "token can't decoded"));
// }

// SALE

export const handleCheckTokenSale = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.headers.authorization)
            return res
                .status(httpStatus.UNAUTHORIZED)
                .json(ResponseHandler(httpStatus.UNAUTHORIZED, null, 'token not found'));

        const token = req.headers.authorization?.replace('Bearer', '').trim();

        let decode = handleVerifyToken(token);

        if (!decode)
            return res
                .status(httpStatus.FORBIDDEN)
                .json(ResponseHandler(httpStatus.FORBIDDEN, null, "token can't decoded"));
        req.body.token_author = decode?.email;

        if (decode.role_detail === role.SALE || decode.role_detail === role.ADMIN) {
            next();
        } else {
            return res.status(403).json(ResponseHandler(httpStatus.FORBIDDEN, null, "your role aren't sale"));
        }
    } catch (err) {
        console.log(err);
        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
    }
};

//ADMIN

export const handleCheckTokenAdmin = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.headers.authorization)
            return res
                .status(httpStatus.UNAUTHORIZED)
                .json(ResponseHandler(httpStatus.UNAUTHORIZED, null, 'token not found'));

        const token = req.headers.authorization?.replace('Bearer', '').trim();

        let decode = handleVerifyToken(token);

        if (!decode)
            return res
                .status(httpStatus.FORBIDDEN)
                .json(ResponseHandler(httpStatus.FORBIDDEN, null, "token can't decoded"));

        if (decode.role_detail === role.ADMIN) {
            req.body.token_author = decode.email;
            next();
        } else {
            return res.status(403).json(ResponseHandler(httpStatus.FORBIDDEN, null, "your role aren't admin"));
        }
    } catch (err) {
        console.log(err);
        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json(ResponseHandler(httpStatus.INTERNAL_SERVER_ERROR, null, 'error from server'));
    }
};
