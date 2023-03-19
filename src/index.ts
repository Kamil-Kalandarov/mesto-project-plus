import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { errors } from 'celebrate';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mainRouter from './routes/index';
import errorHandler from './middlewares/errorHandler';
import NotFoundError from './errors/not-found-err';
import auth from './middlewares/auth';
import { createUser, login } from './controllers/user';
import { requestLogger, errorLogger } from './middlewares/logger';
import { createUserValidation, loginValidation } from './middlewares/validators/userValidator';

dotenv.config();

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());

app.use(requestLogger);

app.use(limiter);

app.post('/signin', loginValidation, login);
app.post('/signup', createUserValidation, createUser);

app.use('/', auth, mainRouter);

// eslint-disable-next-line no-unused-vars
app.use((req: Request, res: Response) => {
  throw new NotFoundError('Страница не найдена');
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

async function connect() {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(MONGO_URL);
    console.log('База данных подключена');
    await app.listen(PORT);
    console.log(`Сервер запущен на порту: ${PORT}`);
  } catch (err) {
    console.log('Ошибка на стороне сервера', err);
  }
}

connect();
