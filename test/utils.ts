import {Logger} from '../src/logger/Logger';

export const testLevels = (
  logger: Logger,
  message: string,
  meta: Record<string, unknown> = {},
) => {
  logger.log(message, {type: 'log', ...meta});
  logger.info(message, {type: 'info', ...meta});
  logger.warn(message, {type: 'warn', ...meta});
  logger.error(message, {type: 'error', ...meta});
  logger.debug(message, {type: 'debug', ...meta});
  logger.trace(message, {type: 'trace', ...meta});
  logger.success(message, {type: 'success', ...meta});
  logger.critical(message, {type: 'critical', ...meta});
  logger.securityAlert(message, {type: 'security', ...meta});
  logger.rainbow(message, {type: 'rainbow', ...meta});
};

export const BIG_META = {
  kind: 'USER',
  id: '00asdf3asc',
  name: 'John Doe',
  email: 'jd123534@company.net',
  role: 'admin',
  permissions: ['read', 'write', 'delete'],
  active: true,
  profile: {
    dob: '1990-01-01',
    bio: 'I am a person who likes to test things',
    avatar: 'https://example.com/avatar.jpg',
  },
} as const;

export const recurseAndThrow = (
  n: number,
  message = 'This is a simulated stack trace error',
) => {
  if (n <= 0) {
    throw new Error(message);
  } else {
    recurseAndThrow(n - 1, message);
  }
};
