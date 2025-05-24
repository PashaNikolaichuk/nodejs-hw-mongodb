import { UsersCollection } from '../db/user.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';

import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/user.js';
import { SessionCollection } from '../db/session.js';
import { randomBytes } from 'crypto';

export const registerUser = async (payload) => {
  const { email } = payload;

  // функція шукає користувача в базі даних за наданою електронною поштою
  const user = await UsersCollection.findOne({ email });

  if (user) throw createHttpError(409, 'Email in use');
  // За допомогою bcrypt.hash(...) шифрує пароль: 10 — кількість раундів хешування
  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    ...payload,
    // замінює звичайний пароль зашифрованим.
    password: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const { email, password } = payload;

  // функція шукає користувача в базі даних за наданою електронною поштою
  const user = await UsersCollection.findOne({ email });

  // якщо такого немає то помилка
  if (!user) {
    createHttpError(401, 'Email or password invalid');
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
