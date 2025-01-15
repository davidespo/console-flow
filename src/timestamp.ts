import moment from 'moment';
import {z} from 'zod';

export const TimestampOptionSchema = z.union([
  z.literal('ISO8601'),
  z.literal('locale'),
  z.literal('unix'),
  z.string(),
  z.boolean(),
]);

export type TimestampOption = z.infer<typeof TimestampOptionSchema>;

export const buildTimestampGenerator = (
  timestamp?: TimestampOption,
): (() => string) => {
  switch (timestamp) {
    case undefined:
    case 'ISO8601':
      return () => new Date().toISOString().substring(0, 19);
    case 'unix':
      return () => Date.now().toString();
    case 'locale':
      return () => new Date().toLocaleString();
    case true:
      return () => new Date().toISOString().substring(11, 19);
    case false:
      return () => '';
    default:
      return () => moment().format(timestamp);
  }
};
