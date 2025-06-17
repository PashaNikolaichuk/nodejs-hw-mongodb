import Joi from 'joi';
import { emailRegext } from '../constants/auth.js';

// Joi — валідація до бази. Mongoose — контроль у самій базі.
export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().pattern(emailRegext).required(), // Email: обов’язковий, відповідає шаблону emailRegext
  password: Joi.string().required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().pattern(emailRegext).required(),
  password: Joi.string().required(),
});

export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});
