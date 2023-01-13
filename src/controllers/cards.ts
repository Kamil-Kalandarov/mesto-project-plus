import BadRequestError from "../errors/bad-request-err";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Cards from '../models/cards';
import NotFoundError from "../errors/not-found-err";
import { RequestCustom } from "../types/types";

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  return Cards.find({})
  .then((cards) => {
    res.status(200).send({ data: cards })
  })
  .catch(next)
};

export const createCard = (req: RequestCustom, res: Response, next: NextFunction) => {
  const { name, link } = req.body
  return Cards.create({name, link, owner: req.user?._id})
  .then((card) => {
    res.status(200).send({ data: card })
  })
  .catch((err) => {
    if(err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError('Переданы некорректные данные при создании карточки'))
    } else {
      next(err)
    }
  })
};

export const deleteCardById = (req: RequestCustom, res: Response, next: NextFunction) => {
  const owner = req.user?._id
  return Cards.findByIdAndRemove(req.params.id)
  .then((card) => {
    if(!card) {
      next(new NotFoundError('Карточка с указанным _id не найдена'))
    }
    if(card && card.owner.toString() === owner) {
      res.status(200).send({data: card})
    }
  })
  .catch(next)
};

export const likeCard = (req: RequestCustom, res: Response, next: NextFunction) => {
  const user = req.user?._id
  const card = req.params.cardId
  return Cards.findByIdAndUpdate(card, {$addToSet: { likes: user }}, {new: true})
  .then((card) => {
    if(!card) {
      next(new NotFoundError('Передан несуществующий _id карточки'))
    } else {
      res.status(200).send({ data: card })
    }
  })
  .catch((err) => {
    if(err instanceof mongoose.Error.CastError){
      next(new BadRequestError('Переданы некорректные данные для постановки лайка'))
    } else {
      next(err)
    }
  })
};

export const dislikeCard = (req: RequestCustom, res: Response, next: NextFunction) => {
  const user = req.user?._id
  const card = req.params.cardId
  return Cards.findByIdAndUpdate(card, {$pull: {likes: user}}, {new: true})
  .then((card) => {
    if(!card) {
      next(new NotFoundError('Передан несуществующий _id карточки'))
    } else {
      res.status(200).send({ data: card })
    }
  })
  .catch((err) => {
    if(err instanceof mongoose.Error.CastError){
      next(new BadRequestError('Переданы некорректные данные для удаления лайка'))
    } else {
      next(err)
    }
  })
}
