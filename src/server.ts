import app from './app';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const PORT = process.env.PORT || 8080;

app.use(cors());

app.listen(PORT, () =>
  console.log(`Server ready at: http://localhost:${PORT}`)
);
