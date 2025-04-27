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

const router = Router();

// Якщо прийде GET-запит на /contacts — спрацює getContactsController.
// ctrlWrapper Це обгортка, яка ловить помилки
router.get('/', ctrlWrapper(getContactsController));

router.get('/:contactsId', ctrlWrapper(getContactsByIdController));

router.post('/', ctrlWrapper(createContactsController));

router.put('/:contactId', ctrlWrapper(upsertContactController));

router.patch('/:contactId', ctrlWrapper(patchContactController));

router.delete('/:contactId', ctrlWrapper(deleteContactController));

export default router;
