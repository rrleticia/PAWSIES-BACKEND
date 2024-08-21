import express from 'express';
import { routes } from './routes';
import { errorMiddleWare } from './shared';

const app = express();

routes(app);
errorMiddleWare(app);

export default app;
