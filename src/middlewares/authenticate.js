import createHttpError from 'http-errors';
// import { findSession } from '../services/auth.js';
// import { findUser } from '../services/auth.js';
import { SessionCollection } from '../db/session.js';
import { UsersCollection } from '../db/user.js';

export const authenticate = async (req, res, next) => {
  // дістаємо Authorization
  const authHeader = req.get('Authorization');

  // Якщо заголовок авторизації не надано, функція викликає помилку з кодом 401 (Будь ласка, надайте заголовок авторизації)
  if (!authHeader) {
    return next(createHttpError(401, 'Authorization header missing'));
  }

  //Витягує тип (Bearer) і сам токен
  const [bearer, token] = authHeader.split(' ');

  //   Переконується, що тип авторизації вірний
  if (bearer !== 'Bearer') {
    return next(createHttpError(401, 'Header must have type Bearer'));
  }

  //Функція шукає сесію в колекції SessionsCollection за наданим токеном доступу.
  const session = await SessionCollection.findOne({ accessToken: token });

  //Якщо сесію не знайдено, функція викликає помилку з кодом 401 (Сесію не знайдено) і передає її до наступної функції.
  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }

  //   якщо дата закінчення меньше ніж дата зараз
  if (session.accessTokenValidUntil < Date.now()) {
    return next(createHttpError(401, 'Access token expired'));
  }

  //Функція шукає користувача в колекції UsersCollection за ідентифікатором користувача, який зберігається в сесії.
  const user = await UsersCollection.findById(session.userId);

  //Якщо користувача не знайдено, функція викликає помилку з кодом 401 і передає її до наступної функції.
  if (!user) {
    return next(createHttpError(401, 'User not found'));
  }

  //це об'єкт користувача, який залогінився й успішно пройшов перевірку токеном через мідлвару authenticate.
  req.user = user;

  next();
};
