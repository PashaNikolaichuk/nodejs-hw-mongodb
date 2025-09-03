export const parseFilterParams = (query) => {
  const { isFavourite, type } = query;

  //   пустий обєкт
  const filter = {};

  if (typeof type === 'string') {
    filter.contactType = type; // Додаємо filter.contactType
  }

  if (typeof isFavourite !== 'undefined') {
    filter.isFavourite = isFavourite === 'true'; // перетворюємо рядок на булеве значення
  }

  return filter;
};
