import mongoose from 'mongoose';
//  твоя утиліта, яка витягує змінні з .env.
import { getEnvVar } from '../utils/getEnvVar.js';

// це асинхронна функція для підключення до MongoDB через mongoose
export const initMongoConnection = async () => {
  try {
    const user = getEnvVar('MONGODB_USER');
    const pwd = getEnvVar('MONGODB_PASSWORD');
    const url = getEnvVar('MONGODB_URL');
    const db = getEnvVar('MONGODB_DB');

    // Підключення до бази даних:
    await mongoose.connect(
      `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`,
    );
    console.log('Mongo connection successfully established!');
  } catch (e) {
    console.log('Error while setting up mongo connection', e);
    throw e;
  }
};
