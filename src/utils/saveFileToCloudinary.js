import cloudinary from 'cloudinary';
import fs from 'node:fs/promises';

import { getEnvVar } from './getEnvVar.js';
import { CLOUDINARY } from '../constants/index.js';

cloudinary.v2.config({
  secure: true,
  cloud_name: getEnvVar(CLOUDINARY.CLOUD_NAME),
  api_key: getEnvVar(CLOUDINARY.API_KEY),
  api_secret: getEnvVar(CLOUDINARY.API_SECRET),
});

export const saveFileToCloudinary = async (file) => {
  //file.path — це шлях до тимчасового файлу (наприклад, ./tmp/12345_image.jpg).
  // завантажує його на сервер Cloudinary
  const response = await cloudinary.v2.uploader.upload(file.path);
  //  видаляє файл із тимчасової папки
  await fs.unlink(file.path);
  //   Повертає пряме HTTPS-посилання на зображення, яке вже зберігається в Cloudinary.
  return response.secure_url;
};
