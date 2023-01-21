import { celebrate, Joi } from "celebrate";
import validator from 'validator';

export const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required()
    .messages({
      'string.min': 'Минимальная длина поля "name" - 2 символа',
      'string.max': 'Максимальная длина поля "name" - 30 символов',
    }),
    link: Joi.string().custom((value: string, helpers: any) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Невалидный URL');
    }),
  }).unknown(true)
});

export const cardIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex()
  }).unknown(true)
});
