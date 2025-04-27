// Звичайне повідомлення, якщо жоден з попередніх маршрутів не підходить.
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
};
