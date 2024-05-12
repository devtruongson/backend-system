import { HttpStatus } from 'http-status';

export const ResponseHandler = <T>(
    HttpStatus: HttpStatus,
    data: T,
    msg: string,
): {
    code: HttpStatus;
    data: T;
    msg: string;
} => {
    return {
        code: HttpStatus,
        data,
        msg,
    };
};
