import express, { Request, Response } from 'express';
import compression from 'compression';
import connectDB from './configs/connectDB';
import initApiRoutes from './routes/api';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(compression());

const corsOption = {
    origin: ['http://localhost:4000', 'http://localhost:3000', 'http://localhost:5173'], //origin from where you requesting
    credentials: true,
};
app.use(cors(corsOption));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

connectDB();

//init API routes
initApiRoutes(app);

app.listen(8081, () => {
    console.log('App starting successfully with port 8081');
});
