import { PrettyOptions } from 'pino-pretty';

const options = {
  destination: 1,
  colorize: true,
  translateTime: 'HH:MM:ss.l',
  ignore: 'SYS:pid,hostname',
} satisfies PrettyOptions;

export const loggerSetup = {
  transport: {
    target: 'pino-pretty',
    options,
  },
};
