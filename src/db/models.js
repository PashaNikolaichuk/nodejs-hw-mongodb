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
      enum: ['work', 'home', 'personal'],
      required: true,
      default: 'personal',
    },
  },
  {
    // встановлює значення true, щоб автоматично створювати поля createdAt та updatedAt, які вказують на час створення та оновлення документа.
    timestamps: true,
  },
);

// Модель — це клас, який використовується для взаємодії з колекцією. Mongoose створює модель за допомогою схеми.
export const ContactsCollection = model('contacts', contactsSchema);
