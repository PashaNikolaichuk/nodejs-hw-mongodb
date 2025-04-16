import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';

import { getEnvVar } from './utils/getEnvVar.js';
import { getAllContacts, getContactsById } from './services/contacts.js';

// Шукає .env файл і додає його змінні в process.env
dotenv.config();

// функція setupServer, яка створює сервер.
export const setupServer = () => {
  const app = express(); //app - web-сервіс

  // Дозволяє працювати з CORS (щоб фронтенд міг надсилати запити).
  app.use(cors());
  // Дозволяє серверу приймати JSON-тіла в запитах
  app.use(express.json());

  //Виводить у консоль усі HTTP-запити (тип, статус, час відповіді) у гарному форматі.
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  // Маршрут
  app.get('/', (req, res) => {
    res.json({
      message: 'Hello world!',
    });
  });

  // Читаємо змінну оточення PORT
  const port = Number(getEnvVar('PORT', 3000));

  // Запуск сервера
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  // Використаймо функції сервісу contacts в контролерах. Для цього створимо два нових маршрути для GET-запитів:
  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  app.get('/contacts/:contactsId', async (req, res) => {
    //всі динамичні шляхи яки написані через двохкрапку, express зберігає в req.params
    const { contactsId } = req.params;
    const contacts = await getContactsById(contactsId);

    // Відповідь, якщо контакт не знайдено
    if (!contacts) {
      res.status(404).json({
        message: 'Contact not found',
      });
      return;
    }

    // Відповідь, якщо контакт знайдено
    res.status(200).json({
      status: 200,
      message: 'Successfully found contact with id {contactId}!',
      data: contacts,
    });
  });

  // Звичайне повідомлення, якщо жоден з попередніх маршрутів не підходить.
  app.use((req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });
};
