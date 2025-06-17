export const handleSaveError = (error, doc, next) => {
  const { code, name } = error;
  error.status = code === 11000 && name === 'MongoServerError' ? 409 : 400;
  next();
};

export const setUpdateSettings = function (next) {
  //в postman буде оновлюватись
  this.options.new = true;
  // вмикай перевірку
  this.options.runValidators = true;
  next();
};
