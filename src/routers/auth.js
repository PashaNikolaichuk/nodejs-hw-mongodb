import { Router } from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  refreshController,
} from '../controllers/auth.js';
import { registerUserSchema, loginUserSchema } from '../validation/auth.js';
import { validateBody } from '../utils/validateBody.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

authRouter.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

authRouter.post('/refresh', ctrlWrapper(refreshController));

authRouter.post('/logout', ctrlWrapper(logoutUserController));

export default authRouter;
