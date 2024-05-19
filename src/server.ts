import express from 'express';
import compression from 'compression';
import connectDB from './configs/connectDB';
import initApiRoutes from './routes/api';
import bodyParser from 'body-parser';
import configCors from './configs/configCors';

const app = express();
configCors(app);

app.use(compression());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

connectDB();

//init API routes
initApiRoutes(app);

app.listen(8081, () => {
    console.log('App starting successfully with port 8081');
});
