import express, { Request, Response } from 'express';
import compression from 'compression';
import connectDB from './configs/connectDB';

const app = express();
app.use(compression());

app.get('/', (req: Request, res: Response) => {
    res.send('test'.repeat(100));
});

connectDB();

app.listen(8081, () => {
    console.log('App starting successfully with port 8081');
});
