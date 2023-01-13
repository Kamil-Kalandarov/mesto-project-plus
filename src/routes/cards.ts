import { Router } from 'express';
import {
  createCard,
   deleteCardById,
   dislikeCard,
   getCards,
   likeCard
  } from '../controllers/cards';

const cardsRouter = Router();

cardsRouter.get('/', getCards);
cardsRouter.post('/', createCard);
cardsRouter.delete('/:id', deleteCardById);
cardsRouter.put('/:cardId/likes', likeCard);
cardsRouter.delete('/:cardId/likes', dislikeCard);

export default cardsRouter;