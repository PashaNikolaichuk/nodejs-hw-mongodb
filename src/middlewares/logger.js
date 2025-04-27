import pino from 'pino-http';

//Виводить усі запити у консоль (тип, статус, час і т.д.)
export const logger = pino({
  transport: {
    target: 'pino-pretty',
  },
});
