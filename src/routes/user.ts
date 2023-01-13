import { Router } from 'express';
import {
  createUser,
  getUserById,
  getUsers,
  updateUserInfo,
  updateUserAvatar
} from '../controllers/user';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:id', getUserById)
userRouter.post('/', createUser);
userRouter.patch('/me', updateUserInfo);
userRouter.patch('/me/avatar', updateUserAvatar);

export default userRouter;