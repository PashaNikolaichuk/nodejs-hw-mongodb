import dotenv from 'dotenv';
//зчитує файл .env і додає всі змінні до process.env
dotenv.config();

//name — назва змінної, яку ти шукаєш у .env (наприклад 'PORT')
// defaultValue (необовязково) — значення за замовчуванням, якщо змінна не задана

//функція для витягування значень з .env файлу
export function getEnvVar(name, defaultValue) {
  //витягуєм з .env по name
  const value = process.env[name];

  if (value) return value;

  if (defaultValue) return defaultValue;

  // функція викликає помилку, щоб ти відразу побачив, що щось не так.
  throw new Error(`Missing: process.env['${name}'].`);
}
