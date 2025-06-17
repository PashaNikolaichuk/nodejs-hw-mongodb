import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';

const bootstrap = async () => {
  await initMongoConnection();
  // Створює тимчасову директорію
  await createDirIfNotExists(TEMP_UPLOAD_DIR);
  // Створює постійну директорію для збереження файлів.
  await createDirIfNotExists(UPLOAD_DIR);
  setupServer();
};

bootstrap();
