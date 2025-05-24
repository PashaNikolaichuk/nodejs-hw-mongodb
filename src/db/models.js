import { typeList } from '../constants/contacts.js';

import { handleSaveError, setUpdateSettings } from './hook.js';

// Схема визначає структуру документів в колекції. Вона визначає поля, типи даних, обмеження та інші властивості документів.
import { model, Schema } from 'mongoose';

// створимо схему для опису структури документа contacts.
const contactsSchema = new Schema(
  {
    name: {
      // вказує тип даних, який ми очікуємо для цього поля.
      type: String,
      //   ця властивість вказує, чи є поле обов'язковим для заповнення.
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    email: {
      type: String,
    },

    isFavourite: {
      type: Boolean,
      //   вказує значення за замовчуванням, якщо поле не вказано при створенні документа.
      default: false,
    },
    contactType: {
      type: String,
      //   це перелік допустимих значень для поля.
      enum: typeList,
      required: true,
      default: typeList[2],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  {
    // встановлює значення true, щоб автоматично створювати поля createdAt та updatedAt, які вказують на час створення та оновлення документа.
    timestamps: true,
    versionKey: false,
  },
);

// якщо після додавання сталася помилка то виконай цю функцію
contactsSchema.post('save', handleSaveError);

// перед оновленням додаю ці запити
contactsSchema.pre('findOneAndUpdate', setUpdateSettings);

contactsSchema.post('findOneAndUpdate', handleSaveError);

// Модель — це клас, який використовується для взаємодії з колекцією. Mongoose створює модель за допомогою схеми.
export const ContactsCollection = model('contacts', contactsSchema);
