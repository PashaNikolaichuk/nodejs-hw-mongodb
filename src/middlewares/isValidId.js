import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

// звичайна (але дуже важлива) перевірка ID
export const isValidId = (req, res, next) => {
  const { contactsId } = req.params;
  //  якщо не правильна  ID то fasle і помилка
  if (!isValidObjectId(contactsId)) {
    throw createHttpError(400, `${contactsId} not valid id`);
  }

  next();
};
