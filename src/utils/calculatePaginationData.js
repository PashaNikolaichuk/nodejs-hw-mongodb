export const calculatePaginationData = (total, perPage, page) => {
  // загальна кількість сторінок
  const totalPages = Math.ceil(total / perPage);
  //   наступна сторінка
  const hasNextPage = totalPages > page;
  //   попередня сторінка
  const hasPreviousPage = 1 > page;

  return {
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};
