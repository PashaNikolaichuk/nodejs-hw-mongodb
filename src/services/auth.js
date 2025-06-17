import { UsersCollection } from '../db/user.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';

import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/user.js';
import { SessionCollection } from '../db/session.js';

import { sendEmail } from '../utils/sendEmail.js';
import { randomBytes } from 'crypto';
import { getEnvVar } from '../utils/getEnvVar.js';
import handlebars from 'handlebars';
import jwt from 'jsonwebtoken';

// вбудований модуль Node.js path — для роботи зі шляхами до файлів.
import path from 'node:path';
import { TEMPLATES_DIR } from '../constants/index.js';
import fs from 'node:fs/promises';

// ДЛЯ СКИДУВАННЯ ПАРОЛЮ
export const requestResetToken = async (email) => {
  // шукаємо в базі користувача з таким email.
  const user = await UsersCollection.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const jwtSecret = getEnvVar('JWT_SECRET');

  // створюємо JWT токен з ID та email користувача
  const resetToken = jwt.sign(
    {
      sub: user._id, // унікальний ідентифікатор користувача
      email, // для зручності
    },
    jwtSecret,
    {
      // час життя токена
      expiresIn: '24h',
    },
  );

  // Отримай значення змінної APP_DOMAIN з .env
  const appDomain = getEnvVar('APP_DOMAIN');

  // Формується повний шлях до конкретного шаблону листа
  const verifyEmailPath = path.join(TEMPLATES_DIR, 'verify-email.html');

  // // дає змогу прочитати його
  const templateSourse = await fs.readFile(verifyEmailPath, 'utf-8');

  // // з тексту зробили хендербар шаблон
  const template = handlebars.compile(templateSourse);

  const html = template({
    verifyLink: `${appDomain}/auth/reset?token=${resetToken}`,
  });

  // надсилаємо лист з посиланням для скидання пароля
  await sendEmail({
    to: email,
    subject: 'Reset your password',
    html,
  });
};

const jwtSecret = getEnvVar('JWT_SECRET');

//payload = password: 'новий пароль' АБО token
export const resetPassword = async (payload) => {
  let entries;

  try {
    //payload.token = Це токен, який користувач отримав на email, містить зашифровану інформацію про користувача
    //jwt.verify = перевіряє токен.
    entries = jwt.verify(payload.token, jwtSecret);
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }

  // відбувається пошук користувача в базі даних
  const user = await UsersCollection.findOne({
    // це email, який був закладений у JWT токен під час створення.
    email: entries.email,
    // це subject, зазвичай це user._id, також вкладений у токен.
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  // Хешування нового пароля
  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  // Оновлення пароля в Базі Даних
  await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};

// 1. РЕГЕСТРАЦІЯ КОРІСТУВАЧА
export const registerUser = async (payload) => {
  const { email } = payload;

  // функція шукає користувача в базі даних за наданою електронною поштою
  const user = await UsersCollection.findOne({ email });

  if (user) throw createHttpError(409, 'Email in use');
  // За допомогою bcrypt.hash(...) шифрує пароль: 10 — кількість раундів хешування
  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  const newUser = await UsersCollection.create({
    ...payload,
    // замінює звичайний пароль зашифрованим.
    password: encryptedPassword,
  });

  return newUser;
};

export const verifyUser = async (token) => {
  try {
    //вона перевіряє  jwt.verify чи дійсний і ще можна витянути email
    const { email } = jwt.verify(token, jwtSecret);
    // ми шукаємо користувача за цим email.
    // Якщо користувач знайдений, оновлюємо його поле verify на true
    await UsersCollection.findOneAndUpdate({ email }, { verify: true });
  } catch {
    throw createHttpError(401, 'Email not verified');
  }
};

export const loginUser = async (payload) => {
  const { email, password } = payload;

  // функція шукає користувача в базі даних за наданою електронною поштою
  const user = await UsersCollection.findOne({ email });

  // якщо такого немає то помилка
  if (!user) {
    throw createHttpError(401, 'Email or password invalid');
  }

  // порівнює наданий пароль (password) із захешованим у базі через bcrypt.compare.
  // true
  const isEqual = await bcrypt.compare(password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'Email or password invalid');
  }

  // функція видаляє попередню сесію користувача, якщо така існує, з колекції сесій(Це робиться для уникнення конфліктів з новою сесією.)
  await SessionCollection.deleteOne({ userId: user._id });

  const newSession = createSession();

  // функція створює нову сесію в базі даних.
  return await SessionCollection.create({
    userId: user._id,
    ...newSession,
  });
};

export const logoutUser = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

// створює токени та час життя
const createSession = () => {
  // ГЕНЕРУЄМО ТОКЕНИ
  // щоб ти не мусив вводити пароль знову кожного разу, коли переходиш по сторінках або робиш запити (наприклад, подивитися профіль, замовлення, тощо).
  // щоб ходити всередині сайту
  const accessToken = randomBytes(30).toString('base64');
  // щоб оновити accessToken, коли він "протух"
  const refreshToken = randomBytes(30).toString('base64');

  const accessTokenValidUntil = new Date(Date.now() + FIFTEEN_MINUTES);
  const refreshTokenValidUntil = new Date(Date.now() + ONE_DAY);

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

export const refreshUsersSession = async ({ refreshToken, sessionId }) => {
  const session = await SessionCollection.findOne({
    refreshToken,
    _id: sessionId,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  // перевіряємо чи не закінчився час життя
  if (session.refreshTokenValidUntil < Date.now()) {
    await SessionCollection.findOneAndDelete({ _id: session._id });
    throw createHttpError(401, 'Session token expired');
  }

  // ГЕНЕРУЄМО ТОКЕНИ
  const sessionToken = createSession();

  // функція створює нову сесію в базі даних.
  return await SessionCollection.create({
    userId: session._id,
    ...sessionToken,
  });
};
