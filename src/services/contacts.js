import { ContactsCollection } from '../db/models.js';

export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find();
  return contacts;
};

export const getContactsById = async (contactsId) => {
  const contacts = await ContactsCollection.findById(contactsId);
  return contacts;
};
