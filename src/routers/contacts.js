import { Router } from 'express';
import {
  getContactsController,
  getContactsByIdController,
  createContactsController,
  upsertContactController,
  patchContactController,
  deleteContactController,
} from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { validateBody } from '../utils/validateBody.js';

import { isValidId } from '../utils/isValidId.js';

import {
  createContactsSchema,
  updateContactsSchema,
} from '../validation/contacts.js';

const router = Router();
// перевіряє дані validateBody,  Він перевіряє дані до того, як потрапити в контролер.
// Якщо прийде GET-запит на /contacts — спрацює getContactsController.
// ctrlWrapper Це обгортка, яка ловить помилки ~~ Express бачить next(err) "перекидає" вас в errorHandler
router.get('/', ctrlWrapper(getContactsController));

router.get('/:contactsId', isValidId, ctrlWrapper(getContactsByIdController));

router.post(
  '/',
  // захищає від невалідних даних.
  validateBody(createContactsSchema),
  ctrlWrapper(createContactsController),
);

router.put(
  '/:contactId',
  isValidId,
  validateBody(createContactsSchema),
  ctrlWrapper(upsertContactController),
);

router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactsSchema),
  ctrlWrapper(patchContactController),
);

router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default router;
