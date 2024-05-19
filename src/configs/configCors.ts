import { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

export default function configCors(app: Express) {
    const corsOption = {
        origin: ['http://localhost:4000', 'http://localhost:3000', 'http://localhost:5173'], //origin from where you requesting
        credentials: true,
    };

    app.use(cors(corsOption));
}
