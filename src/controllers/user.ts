import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/user';
import NotFoundError from '../errors/not-found-err';
import BadRequestError from '../errors/bad-request-err';
import { RequestCustom } from '../types/types';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
   User.find({})
  .then((users) => {
      res.status(200).send({ data: users });
    })
  .catch(next);
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
   User.findById(req.params.id)
  .then((user) => {
    if (!user) {
      next(new NotFoundError('Пользователь по указанному _id не найден'));
    } else {
      res.status(200).send({ data: user });
    }
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError('Переданы некорректные данные, ошибка валидации'));
    } else {
      next(err);
    }
  });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;
   User.create({ name, about, avatar })
  .then((user) => {
    res.status(200).send({ data: user });
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
    } else {
      next(err);
    }
  });
};

export const updateUserInfo = (req: RequestCustom, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  const selectedUser = req.user?._id;
   User.findByIdAndUpdate(selectedUser, { name, about })
  .then((user) => {
    if (!user) {
      next(new NotFoundError('Пользователь с указанным _id не найден'));
    } else {
      res.status(200).send({ data: user });
    }
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
    } else {
      next(err);
    }
  });
};

export const updateUserAvatar = (req: RequestCustom, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  const selectedUser = req.user?._id;
   User.findByIdAndUpdate(selectedUser, { avatar })
  .then((user) => {
    if (!user) {
      next(new NotFoundError('Пользователь с указанным _id не найден'));
    } else {
      res.status(200).send({ data: user });
    }
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.ValidationError) {
      next(next(new BadRequestError('Переданы некорректные данные при обновлении профиля')));
    } else {
      next(err);
    }
  });
};
