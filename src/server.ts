import express, { Request, Response } from 'express';
import ownerRoutes from './owners';

const app = express();
const port = 3000;

app.use(express.json());

app.use('/', ownerRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
