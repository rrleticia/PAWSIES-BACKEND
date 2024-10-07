import express from 'express';
import { routes } from './routes';
import { errorMiddleWare, loggerMiddleWare } from './shared';

const app = express();

loggerMiddleWare(app);

routes(app);

errorMiddleWare(app);

export default app;
