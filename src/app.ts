import express from 'express';
import { routes } from './routes';
import { errorMiddleWare, loggerMiddleWare } from './shared';

const app = express();

routes(app);
loggerMiddleWare(app);
errorMiddleWare(app);

export default app;
