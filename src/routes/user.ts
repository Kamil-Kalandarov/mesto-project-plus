import { Router } from 'express';
import {
  getUserByIdValidation,
  updateUserInfoValidation,
  updateUserAvatarValidation,
} from '../middlewares/validators/userValidator';
import {
  getUserById,
  getUsers,
  getUser,
  updateUserInfo,
  updateUserAvatar,
} from '../controllers/user';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/me', getUser);
userRouter.get('/:id', getUserByIdValidation, getUserById);
userRouter.patch('/me', updateUserInfoValidation, updateUserInfo);
userRouter.patch('/me/avatar', updateUserAvatarValidation, updateUserAvatar);

export default userRouter;
