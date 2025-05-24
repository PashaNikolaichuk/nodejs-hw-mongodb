// полегшує створення веб-серверів.
import express from 'express';
// дає можливість фронтенду робити запити до бекенду.
import cors from 'cors';
// дозволяє зчитувати змінні з .env файлу
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import { getEnvVar } from './utils/getEnvVar.js';

import router from './routers/contacts.js';
import authRouter from './routers/auth.js';

import { logger } from './middlewares/logger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

// Цей рядок завантажує змінні з .env у process.env
dotenv.config();

// функція setupServer, яка створює сервер.
export const setupServer = () => {
  const app = express(); //app - web-сервіс

  // Дозволяє запити (фронтенд <-> бекенд).
  app.use(cors());
  // Дозволяє серверу приймати JSON-тіла в запитах
  app.use(express.json());
  app.use(cookieParser());

  //Виводить усі запити у консоль (тип, статус, час і т.д.)
  app.use(logger);

  // коли прийде будь-який запит який починається на /contacts' то шукай його в router
  app.use('/contacts', router);
  // коли прийде будь-який запит який починається на /auth' то шукай його в authRouter
  app.use('/auth', authRouter);

  // Звичайне повідомлення, якщо жоден з попередніх маршрутів не підходить.
  app.use(notFoundHandler);

  app.use(errorHandler);

  // Читаємо змінну оточення PORT
  const port = Number(getEnvVar('PORT', 3000));

  // Запуск сервера
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};
