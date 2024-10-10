import app from './app';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';

dotenv.config();
const PORT = process.env.PORT || 8080;

app.use(cors());

app.use(bodyParser.json());

app.listen(PORT, () =>
  console.log(`Server ready at: http://localhost:${PORT}`)
);
