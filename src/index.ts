import express, { Request, Response } from 'express';
import { errors } from 'celebrate';
import errorHandler from './middlewares/errorHandler';
import mongoose from 'mongoose';
import mainRouter from './routes/index';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import NotFoundError from './errors/not-found-err';
import auth from './middlewares/auth';
import { createUser, login } from './controllers/user';
import { requestLogger, errorLogger } from './middlewares/logger';
import { createUserValidation, loginValidation } from './middlewares/validators/userValidator';

const { PORT = 3000 } = process.env;

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(limiter);
app.use(helmet());

app.use(requestLogger);

app.post('/signin', loginValidation, login);
app.post('/signup', createUserValidation, createUser);

app.use('/', auth, mainRouter);

app.use((req: Request, res: Response) => {
  throw new NotFoundError('Страница не найдена')
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

async function connect() {
  try {
    mongoose.set('strictQuery', true)
    await mongoose.connect('mongodb://localhost:27017/mestodb')
    console.log('База данных подключена')
    await app.listen(PORT)
    console.log(`Сервер запущен на порту: ${PORT}`)
  } catch(err) {
    console.log('Ошибка на стороне сервера', err);
  }
};

connect();
