import { ContactsCollection } from '../db/models.js';

import { calculatePaginationData } from '../utils/calculatePaginationData.js';

import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = SORT_ORDER.ASC,
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const data = await ContactsCollection.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const totalItems = await ContactsCollection.find().countDocuments(filter);

  const paginationData = calculatePaginationData(totalItems, perPage, page);

  return {
    data,
    page,
    perPage,
    totalItems,
    ...paginationData,
  };
};

export const getContactsById = async (contactsId) => {
  const contacts = await ContactsCollection.findById(contactsId);
  return contacts;
};

export const createContacts = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};
//contactId це обєкт, який містить умови пошуку документа
//payload обєкт, який містить дані для оновлення.
//option oбєкт додаткових налаштувань
export const updateContact = async (contactId, payload, options = {}) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      //в postman буде оновлюватись
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  //якшо не додали або обновили поверни null
  if (!rawResult || !rawResult.value) return null;

  return {
    // обєкт який додали або обновили
    contact: rawResult.value,
    // чи додали чи обновили
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteContact = async (contactId) => {
  const contact = ContactsCollection.findOneAndDelete({
    _id: contactId,
  });

  return contact;
};
