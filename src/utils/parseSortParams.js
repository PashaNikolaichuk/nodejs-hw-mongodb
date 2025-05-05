import { SORT_ORDER } from '../constants/index.js';

const parseSortOrder = (sortOrder) => {
  //   Якщо вказаний порядок сортування входить до цього списку, функція повертає його
  const isKnownOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder);

  if (isKnownOrder) return sortOrder;

  //   Якщо порядок сортування не відомий або відсутній, за замовчуванням функція встановлює порядок сортування на зростання (ASC).
  return SORT_ORDER.ASC;
};

const parseSortBy = (sortBy) => {
  const keysOfStudent = [
    '_id',
    'name',
    'phoneNumber',
    'email',
    'isFavourite',
    'contactType',
    'createdAt',
    'updatedAt',
  ];

  //   Вона перевіряє, чи входить дане поле до списку допустимих полів
  if (keysOfStudent.includes(sortBy)) {
    return sortBy;
  }
  //   Якщо ж ні — за замовчуванням повертається поле _id.
  return '_id';
};

export const parseSortParams = (query) => {
  const { sortBy, sortOrder } = query;

  const parsedSortBy = parseSortBy(sortBy);
  const parsedSortOrder = parseSortOrder(sortOrder);

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};
