// бібліотека для надсилання email через SMTP.
import nodemailer from 'nodemailer';
import 'dotenv/config';
// утиліта для безпечного доступу до змінних оточення (з помилкою, якщо їх нема).
import { getEnvVar } from '../utils/getEnvVar.js';

const user = getEnvVar('SMTP_USER');
const pass = getEnvVar('SMTP_PASSWORD');

const nodemailerConfig = {
  // хост для надсилання пошти.
  host: getEnvVar('SMTP_HOST'),
  // стандартний порт для SSL.
  port: Number(getEnvVar('SMTP_PORT')),
  // включено шифрування.
  secure: false,
  //  дані для авторизації.
  auth: {
    user,
    pass,
  },
};

// Створюється об'єкт transport, який і відповідає за відправку листів.
const transport = nodemailer.createTransport(nodemailerConfig);

export const sendEmail = (data) => {
  // data (to, subject, html),
  const email = { ...data, from: user };
  return transport.sendMail(email);
};
