import express, { Request, Response } from 'express';
const app = express();

app.get('/', (req: Request, res: Response) => {
    res.status(201).json({
        err: 0,
        msg: 'ok',
    });
});

app.listen(8081, () => {
    console.log('App starting successfully with port 8081');
});
