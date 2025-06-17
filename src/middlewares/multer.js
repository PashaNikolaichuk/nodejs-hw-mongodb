// Приймати файли, які надсилають з форми (multipart/form-data).
//Обробляти ці файли
import multer from 'multer';

import { TEMP_UPLOAD_DIR } from '../constants/index.js';

// Не обробляє, не завантажує кудись — тільки кладе файл у папку на сервері, Дає кожному файлу унікальне ім’я
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, TEMP_UPLOAD_DIR); // Куди зберігати файл
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now(); // Унікальний префікс, щоб уникнути конфліктів
    cb(null, `${uniqueSuffix}_${file.originalname}`); // Ім’я файлу при збереженні
  },
});

export const upload = multer({ storage });
