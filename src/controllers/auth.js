import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUsersSession,
} from '../services/auth.js';
import { ONE_DAY } from '../constants/user.js';

const setupSession = (res, session) => {
  // для браузера
  //Ми передаємо токени браузеру, щоб браузер "памятав" хто ти, і не розлогінював тебе при переході між сторінками або оновленні сторінки.
  res.cookie('refreshToken', session.refreshToken, {
    // Це захист від XSS-атак
    httpOnly: true,
    // час життя cookie
    expires: new Date(Date.now() + ONE_DAY),
  });

  // Його можна використати для перевірки або пошуку сесії в базі даних.
  res.cookie('sessionId', session._id, {
    // Це захист від XSS-атак
    httpOnly: true,
    // час життя cookie
    expires: new Date(Date.now() + ONE_DAY),
  });
};

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    user,
  });
};

// виконує процес обробки запиту на вхід користувача
export const loginUserController = async (req, res) => {
  // яке містить дані для входу (email та пароль).
  const session = await loginUser(req.body);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

// виконує процес обробки запиту на вихід користувача і взаємодію з клієнтом через HTTP.
export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    // Це дозволяє видалити сесію користувача з бази даних або здійснити інші необхідні дії для виходу користувача.
    await logoutUser(req.cookies.sessionId);
  }

  //видаляє відповідні куки з браузера клієнта, що забезпечує вихід користувача з системи на стороні клієнта.
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

export const refreshController = async (req, res) => {
  const session = await refreshUsersSession(req.cookies);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Session successfult refresh',
    data: {
      accessToken: session.accessToken,
    },
  });
};
