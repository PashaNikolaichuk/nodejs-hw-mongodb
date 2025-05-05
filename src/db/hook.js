export const handleSaveError = (error, doc, next) => {
  error.status = 400;
  next();
};

export const setUpdateSettings = function (next) {
  //в postman буде оновлюватись
  this.options.new = true;
  // вмикай перевірку
  this.options.runValidators = true;
  next();
};
