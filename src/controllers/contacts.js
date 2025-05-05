import {
  getAllContacts,
  getContactsById,
  createContacts,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

import { createContactsSchema } from '../validation/contacts.js';

import createHttpError from 'http-errors';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactsByIdController = async (req, res) => {
  //всі динамичні шляхи яки написані через двохкрапку, express зберігає в req.params
  const { contactsId } = req.params;
  const contact = await getContactsById(contactsId);

  // Відповідь, якщо контакт не знайдено
  if (!contact) {
    throw createHttpError(404, 'Contacts not found');
  }

  // Відповідь, якщо контакт знайдено
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactsId}!`,
    data: contact,
  });
};

export const createContactsController = async (req, res) => {
  try {
    await createContactsSchema.validateAsync(req.body, {
      abortEarly: false,
    });
  } catch (error) {
    throw createHttpError(400, error.message);
  }

  const contact = await createContacts(req.body);

  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

export const upsertContactController = async (req, res) => {
  const { contactId } = req.params;
  // req.body це те шо ми вводим в postman
  const result = await updateContact(contactId, req.body, {
    // якщо ресурсу немає то створи
    upsert: true,
  });

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  // якщо то створився статус 201 якщо обновився то 200
  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: `Successfully upserted a Contact!`,
    data: result,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;

  const result = await updateContact(contactId, req.body);

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully patched a Contact!`,
    data: result.contact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;

  const contact = await deleteContact(contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};
