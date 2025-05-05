import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

// звичайна (але дуже важлива) перевірка ID
export const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  //  якщо не правильна  ID то fasle і помилка
  if (!isValidObjectId(contactId)) {
    throw createHttpError(400, 'Bad Request');
  }

  next();
};
