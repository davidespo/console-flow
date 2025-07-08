import {z} from 'zod';
import {TimestampOptionSchema} from '../timestamp';
import {GcpLoggerOptionsSchema} from './gcp';

export const LoggerOptionsSchema = z.object({
  prefix: z
    .object({
      value: z.string(),
      /**
       * Can be a named color or a hex color
       */
      color: z.string().optional(),
    })
    .optional(),
  /**
   * Defaults to INFO
   */
  filename: z.string().optional(),
  level: z.string().optional(),
  timestamp: TimestampOptionSchema.optional(),
  format: z
    .enum(['gcp', 'cloud', 'json', 'prettyJson', 'cli', 'browser'])
    .optional(),
  /**
   * GCP-specific options (used when format is 'gcp' or 'cloud')
   */
  gcp: GcpLoggerOptionsSchema.optional(),
});

export type LoggerOptions = z.infer<typeof LoggerOptionsSchema>;
