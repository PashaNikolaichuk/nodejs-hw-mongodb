import createHttpError from 'http-errors';

export const validateBody = (schema) => {
  const func = async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, {
        abortEarly: false, // Показати всі помилки, а не лише першу
      });

      next(); // якщо все добре — йдемо далі
    } catch (error) {
      // якщо Joi повертає помилки — створюємо помилку 400
      next(createHttpError(400, error.message));
    }
  };
  return func;
};
