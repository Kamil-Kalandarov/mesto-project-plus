import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user';
import NotFoundError from '../errors/not-found-err';
import BadRequestError from '../errors/bad-request-err';
import { RequestCustom } from '../types/types';
import ConflictError from '../errors/conflict-error';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => {
      res.status(200).send({ data: users });
    })
    .catch(next);
};

export const getUser = (req: RequestCustom, res: Response, next: NextFunction) => {
  User.findById(req.user?._id)
    .orFail(new NotFoundError('Пользователь по указанному _id не найден'))
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch(next);
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.id)
    .orFail(new NotFoundError('Пользователь по указанному _id не найден'))
    .then((user) => {
      res.status(200).send({ data: user });
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
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash: string) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      }
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
  User.findByIdAndUpdate(selectedUser, { name, about }, { new: true, runValidators: true })
    .orFail(new NotFoundError('Пользователь с указанным _id не найден'))
    .then((user) => {
      res.status(201).send({ data: user });
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
  User.findByIdAndUpdate(selectedUser, { avatar }, { new: true, runValidators: true })
    .orFail(new NotFoundError('Пользователь с указанным _id не найден'))
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next((new BadRequestError('Переданы некорректные данные при обновлении профиля')));
      } else {
        next(err);
      }
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch(next);
};
