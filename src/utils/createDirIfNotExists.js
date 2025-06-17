import fs from 'node:fs/promises';

export const createDirIfNotExists = async (url) => {
  try {
    await fs.access(url); // перевірка існування папки
  } catch (error) {
    // Якщо виникає помилка ENOENT (немає такого шляху)
    if (error.code === 'ENOENT') {
      // то створи
      await fs.mkdir(url);
    }
  }
};
