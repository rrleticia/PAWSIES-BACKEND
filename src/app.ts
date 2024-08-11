import express from 'express';
import { routes } from './routes';
import { errorMiddleWare } from './common';

const app = express();

routes(app);
errorMiddleWare(app);

export default app;
