import { HttpStatus } from 'http-status';

export const ResponseHandler = <T>(
    HttpStatus: number,
    data: T,
    msg: string,
): {
    code: number;
    data: T;
    msg: string;
} => {
    return {
        code: HttpStatus,
        msg,
        data,
    };
};
