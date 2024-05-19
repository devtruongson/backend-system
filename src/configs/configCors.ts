import { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

export default function configCors(app: Express) {
    app.use((req: Request, res: Response, next: NextFunction) => {
        res.setHeader('Access-Control-Allow-Origin', process.env.REACT_URL as string);
        res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT ,OPTIONS , PATCH , DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
        res.header('Access-Control-Allow-Credentials', 'true');

        next();
    });
}
