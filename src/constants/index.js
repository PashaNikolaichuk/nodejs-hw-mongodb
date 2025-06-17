//вбудований модуль Node.js path — для роботи зі шляхами до файлів.
import path from 'node:path';

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

// не писати вручну шлях до папки з шаблонами у кожному файлі
export const TEMPLATES_DIR = path.resolve('src', 'templates');

export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};
//process.cwd() повертає поточну робочу директорію, тобто корінь проєкту
// path.join(...) — об'єднує шляхи, автоматично додаючи потрібні / або \
export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'src', 'temp'); // тимчасово

export const UPLOAD_DIR = path.join(process.cwd(), 'src', 'uploads'); // постійно

export const CLOUDINARY = {
  CLOUD_NAME: 'CLOUD_NAME',
  API_KEY: 'CLOUD_API_KEY',
  API_SECRET: 'CLOUD_API_SECRET',
};
