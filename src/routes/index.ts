import { Router } from 'express';
import cardsRouter from './cards';
import userRouter from './user';

const mainRouter = Router();

mainRouter.use('/users', userRouter);
mainRouter.use('/cards', cardsRouter);

export default mainRouter;
