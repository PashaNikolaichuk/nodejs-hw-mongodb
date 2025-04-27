import { ContactsCollection } from '../db/models.js';

export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find();
  return contacts;
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
