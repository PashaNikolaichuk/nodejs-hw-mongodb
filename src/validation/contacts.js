import Joi from 'joi';

import { typeList } from '../constants/contacts.js';

export const createContactsSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'any.required': 'Треба вказати назву контакту',
    'string.base': "Ім'я користувача має бути рядком", // Кастомізація повідомлення для типу "string"
    'string.min': "Ім'я користувача має містити щонайменше {#limit} символів",
    'string.max': "'Ім'я користувача має містити щонайбільше {#limit} символів",
  }),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().min(3).max(20),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .min(3)
    .max(20)
    .valid(...typeList)
    .required(),
});

export const updateContactsSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().min(3).max(20),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .min(3)
    .max(20)
    .valid(...typeList),
});
