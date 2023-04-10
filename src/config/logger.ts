import { PrettyOptions } from 'pino-pretty';

const options: PrettyOptions = {
  destination: 1,
  colorize: true,
  translateTime: 'HH:MM:ss.l',
  ignore: 'SYS:pid,hostname',
};

export const prettyLog = {
  transport: {
    target: 'pino-pretty',
    options,
  },
};
