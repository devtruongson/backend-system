import express, { Request, Response } from 'express';
import compression from 'compression';
import connectDB from './configs/connectDB';
import initApiRoutes from './routes/api';

const app = express();
app.use(compression());

app.get('/', (req: Request, res: Response) => {
    res.send('test'.repeat(100000));
});

connectDB();


//init API routes
initApiRoutes(app);

app.listen(8081, () => {
    console.log('App starting successfully with port 8081');
});
