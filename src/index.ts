import express, { Response, NextFunction } from 'express';
import errorHandler from './middlewares/errorHandler';
import mongoose from 'mongoose';
import mainRouter from './routes/index';
import { RequestCustom } from './types/types';

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: RequestCustom, res: Response, next: NextFunction) => {
  req.user = {
    _id: '63befa866f84444c1d9cc58a'
  };
  next();
});

app.use('/', mainRouter);

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
