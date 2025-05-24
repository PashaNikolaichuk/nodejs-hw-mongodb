import { model, Schema } from 'mongoose';

import { handleSaveError, setUpdateSettings } from './hook.js';

// описує структуру об'єкта користувача в базі даних MongoDB
const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    // дає тимчасовий доступ до ресурсів.
    accessTokenValidUntil: {
      // Час, до якого дійсний
      type: Date,
      required: true,
    },
    //  дозволяє отримати новий accessToken, коли старий закінчився.
    refreshTokenValidUntil: {
      // Час, до якого дійсний
      type: Date,
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

// якщо після додавання сталася помилка то виконай цю функцію
sessionSchema.post('save', handleSaveError);

// перед оновленням додаю ці запити
sessionSchema.pre('findOneAndUpdate', setUpdateSettings);

sessionSchema.post('findOneAndUpdate', handleSaveError);

// Модель — це клас, який використовується для взаємодії з колекцією. Mongoose створює модель за допомогою схеми.
export const SessionCollection = model('session', sessionSchema);
