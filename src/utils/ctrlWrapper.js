// ctrlWrapper потрібен саме для того, щоб, якщо у контролері станеться помилка, її не "втратити", а передати далі.
export const ctrlWrapper = (controller) => {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (err) {
      // Якщо ви викликаєте next(err), то Express розуміє, що сталася помилка,
      // і автоматично шукає наступний обробник, який має 4 аргументи (err, req, res, next). а саме в errorHandler
      next(err);
    }
  };
};
