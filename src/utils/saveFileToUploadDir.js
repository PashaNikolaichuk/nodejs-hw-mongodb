import path from 'node:path';
import fs from 'node:fs/promises';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from '../constants/index.js';
import { getEnvVar } from './getEnvVar.js';

export const saveFileToUploadDir = async (file) => {
  // переносить файл з тимчасової папки(TEMP_UPLOAD_DIR) в основну (UPLOAD_DIR).
  await fs.rename(
    path.join(TEMP_UPLOAD_DIR, file.filename),
    path.join(UPLOAD_DIR, file.filename),
  );
  //APP_DOMAIN - базовий домен(http://localhost:3000).
  return `${getEnvVar('APP_DOMAIN')}/uploads/${file.filename}`;
};
