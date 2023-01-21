import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import BadRequestError from '../errors/bad-request-err';
import UnauthorizedError from '../errors/unauthorized_error';
import Cards from '../models/cards';
import NotFoundError from '../errors/not-found-err';
import { RequestCustom } from '../types/types';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Cards.find({})
    .then((cards) => {
      res.status(200).send({ data: cards });
    })
    .catch(next);
};

export const createCard = (req: RequestCustom, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  Cards.create({ name, link, owner: req.user?._id })
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

export const deleteCardById = (req: RequestCustom, res: Response, next: NextFunction) => {
  const owner = req.user?._id;
  Cards.findById(req.params.id)
    .orFail(new NotFoundError('Карточка с указанным _id не найдена'))
    .then((card) => {
      if (card.owner.toString() !== owner) {
        next(new UnauthorizedError('Недостаточно прав'));
      } else {
        card.delete();
        res.status(200).send({ message: 'Карточка удалена' });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные при удалении карточки'));
      } else {
        next(err);
      }
    });
};

export const likeCard = (req: RequestCustom, res: Response, next: NextFunction) => {
  const user = req.user?._id;
  const selectedCard = req.params.cardId;
  Cards.findByIdAndUpdate(selectedCard, { $addToSet: { likes: user } }, { new: true })
    .orFail(new NotFoundError('Передан несуществующий _id карточки'))
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
      } else {
        next(err);
      }
    });
};

export const dislikeCard = (req: RequestCustom, res: Response, next: NextFunction) => {
  const user = req.user?._id;
  const selectedCard = req.params.cardId;
  Cards.findByIdAndUpdate(selectedCard, { $pull: { likes: user } }, { new: true })
    .orFail(new NotFoundError('Передан несуществующий _id карточки'))
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные для удаления лайка'));
      } else {
        next(err);
      }
    });
};
