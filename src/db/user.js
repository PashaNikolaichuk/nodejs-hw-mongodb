import { model, Schema } from 'mongoose';

import { handleSaveError, setUpdateSettings } from './hook.js';

import { emailRegext } from '../constants/auth.js';

// Контролювати що саме зберігається в базі
// Під час збереження в MongoDB

// описує структуру об'єкта користувача в базі даних MongoDB
const userSchema = new Schema(
  {
    name: {
      type: String,
      //   ця властивість вказує, чи є поле обов'язковим для заповнення.
      required: true,
    },

    email: {
      type: String,
      // цей рядок повинен відповідати шаблону emailRegext.
      match: emailRegext,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    verify: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// якщо після додавання сталася помилка то виконай цю функцію
userSchema.post('save', handleSaveError);

// перед оновленням додаю ці запити
userSchema.pre('findOneAndUpdate', setUpdateSettings);

userSchema.post('findOneAndUpdate', handleSaveError);

// Модель — це клас, який використовується для взаємодії з колекцією. Mongoose створює модель за допомогою схеми.
export const UsersCollection = model('users', userSchema);
