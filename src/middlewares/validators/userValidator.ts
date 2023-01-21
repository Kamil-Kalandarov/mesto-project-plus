import { celebrate, Joi } from "celebrate";
import validator from 'validator';

export const createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30)
    .messages({
      'string.min': 'Минимальная длина поля "name" - 2 символа',
      'string.max': 'Максимальная длина поля "name" - 30 символов',
    }),
    about: Joi.string().min(2).max(200)
    .messages({
      'string.min': 'Минимальная длина поля "about" - 2 символа',
      'string.max': 'Максимальная длина поля "about" - 200 символов',
    }),
    avatar: Joi.string().custom((value: string, helpers: any) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Невалидный URL');
    }),
    email: Joi.string().required().email()
    .messages({
      'string.email': 'Невалидный email',

    }),
    password: Joi.string().min(5).max(30).required()
    .messages({
      'string.min': 'Минимальная длина пароля - 5 символов',
      'string.max': 'Максимальная длина пароля - 30 символов',
    })
  }).unknown(true)
});

export const getUserByIdValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex()
  }).unknown(true)
});

export const updateUserInfoValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required()
    .messages({
      'string.min': 'Минимальная длина поля "name" - 2 символа',
      'string.max': 'Максимальная длина поля "name" - 30 символов',
    }),
    about: Joi.string().min(2).max(200).required()
    .messages({
      'string.min': 'Минимальная длина поля "about" - 2 символа',
      'string.max': 'Максимальная длина поля "about" - 200 символов',
    }),
  }).unknown(true)
});

export const updateUserAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom((value: string, helpers: any) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Невалидный URL');
    }),
  }).unknown(true)
});

export const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
    .messages({
      'string.email': 'Невалидный email',
    }),
    password: Joi.string().required()
  }).unknown(true)
})
