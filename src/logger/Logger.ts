import {LoggerOptions} from '../types';
import {
  LEVEL_CRITICAL,
  LEVEL_DEBUG,
  LEVEL_ERROR,
  LEVEL_INFO,
  LEVEL_RAINBOW,
  LEVEL_SECURITY_ALERT,
  LEVEL_SUCCESS,
  LEVEL_TRACE,
  LEVEL_WARN,
  LOGGER_LEVELS,
  LoggerLevel,
} from '../levels';
import _ from 'lodash';
import {addColor, colorStack, ColorStrategy} from '../colors';
import {buildTimestampGenerator} from '../timestamp';
import {GcpLogEntryBuilder} from './GcpLogEntryBuilder';

type LogContext = unknown;
export type LogFunc = (
  arg1?: string | Error | LogContext,
  arg2?: Error | LogContext,
  arg3?: LogContext,
) => void;

export type LogEntry = {
  level: string;
  timestamp: string;
  message: string;
  metadata: {
    context: unknown;
    scope: LoggerOptions['prefix'];
    filename?: string | undefined;
    error?: {
      name: string | undefined;
      stack: string | undefined;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
};

type LogEntryData = LogEntry & {
  prefix: string;
};

/**
 *# TODO Move this to a proper format handler with support for custom formats...
 *# need a different format for json vs. console. Would be nice to add support
 *# for filenames and line numbers in the console formatter.
 */
const compileMessage = _.template(
  "<%= prefix ? prefix + ' - ' : '' %>[<%= level %>][<%= timestamp %>]<%= metadata.filename ? '[' + metadata.filename + ']' : '' %> <%= message.includes('╔') || message.includes('┌') ? '\\n' + message : message %> <%= metadata.context %><%= (metadata.error && metadata.error.stack) ? '\\n' + metadata.error.stack : '' %>",
);

export type LoggerPlugin = {
  name: string;
  version: string;
  processEntry: (entry: LogEntry) => LogEntry;
};

/**
 * A flexible logging utility that provides multiple output formats and log levels.
 *
 * Features:
 * - Multiple output formats (CLI, JSON, Pretty JSON, GCP Cloud Logging)
 * - Customizable log levels with color support
 * - Timestamp formatting options
 * - Error stack trace handling
 * - Context/metadata support
 * - Plugin system for log processing
 *
 * @example
 * ```typescript
 * // Basic usage
 * const logger = new Logger({format: 'cli'});
 * logger.info('Hello world');
 *
 * // With context
 * logger.info('User logged in', {userId: 123});
 *
 * // With error
 * logger.error('Operation failed', new Error('DB connection error'));
 *
 * // Configure console
 * Logger.configureConsole({
 *   format: 'cli',
 *   prefix: {value: 'my-app', color: 'blue'}
 * });
 * console.info('Now uses enhanced logging');
 * ```
 */
export class Logger {
  private static plugins: LoggerPlugin[] = [];

  private readonly coloredPrefix: string;
  private readonly getTimestamp: () => string;
  private readonly __log: LogFunc = console.__log ?? console.log;
  constructor(private readonly options: LoggerOptions) {
    this.coloredPrefix = !options.prefix
      ? ''
      : options.prefix?.color
      ? addColor(options.prefix.value, options.prefix.color)
      : options.prefix.value;
    this.getTimestamp = buildTimestampGenerator(options.timestamp);
  }

  protected _asJson(
    level: string,
    message: string | undefined,
    error: Error | undefined,
    context: unknown | undefined,
  ): LogEntry {
    /**
     * Handle Arg1
     */
    if (!message) {
      if (error) {
        message = error.message;
      } else if (typeof context !== 'undefined') {
        // message = JSON.stringify(context);
        message = '';
      } else {
        message = '\n';
      }
    }
    let errorMetadata: LogEntry['metadata']['error'] | undefined = undefined;
    if (error) {
      const {stack, name, ...errorCustomProperties} = error;
      errorMetadata = {name, stack, ...errorCustomProperties};
    }

    const entry: LogEntry = {
      level,
      timestamp: this.getTimestamp(),
      message,
      metadata: {
        context,
        scope: this.options.prefix,
        filename: this.options.filename,
        error: errorMetadata,
      },
    };
    return Logger.plugins.reduce(
      (acc, plugin) => plugin.processEntry(acc),
      entry,
    );
  }

  asJson(
    level: string,
    arg1: unknown,
    arg2: Error | unknown,
    arg3: unknown,
  ): LogEntry {
    if (typeof arg1 === 'string') {
      if (arg2 instanceof Error) {
        return this._asJson(level, arg1, arg2, arg3);
      } else {
        return this._asJson(level, arg1, undefined, arg2);
      }
    } else if (arg1 instanceof Error) {
      return this._asJson(level, undefined, arg1, arg2);
    } else if (typeof arg1 === 'undefined') {
      return this._asJson(level, undefined, undefined, arg1);
    } else {
      return this._asJson(level, undefined, undefined, arg1);
    }
  }

  asLog(
    level: LoggerLevel,
    arg1: unknown,
    arg2: Error | unknown,
    arg3: unknown,
  ): string | LogEntry {
    const entry = this.asJson(level.key, arg1, arg2, arg3);

    switch (this.options.format) {
      case 'gcp':
      case 'cloud': {
        // Use RFC3339 timestamp for GCP format
        if (this.options.timestamp !== 'RFC3339') {
          entry.timestamp = new Date().toISOString();
        }

        // Create GCP LogEntry
        const gcpBuilder = new GcpLogEntryBuilder(this.options.gcp);
        const gcpEntry = gcpBuilder.buildGcpLogEntry(entry);

        return JSON.stringify(gcpEntry);
      }

      case 'json':
        // Strip all colors for JSON format
        entry.message = ColorStrategy.json(entry.message);
        // Also strip colors from context if it's a string
        if (typeof entry.metadata.context === 'string') {
          entry.metadata.context = ColorStrategy.json(entry.metadata.context);
        }
        return JSON.stringify(entry);

      case 'prettyJson': {
        // Strip all colors for pretty JSON format
        entry.message = ColorStrategy.prettyJson(entry.message);
        // Also strip colors from context if it's a string
        if (typeof entry.metadata.context === 'string') {
          entry.metadata.context = ColorStrategy.prettyJson(
            entry.metadata.context,
          );
        }
        const logContent = JSON.stringify(entry, null, 2);
        return level.primary(logContent);
      }

      case undefined:
      case 'cli':
      case 'browser':
      default: {
        // For console formats, handle colors intelligently
        const messageData = _.cloneDeep(entry) as LogEntryData;
        messageData.prefix = this.coloredPrefix;

        const jsonMessageContext = entry.metadata.context as unknown;
        let metaContext = '';

        if (jsonMessageContext) {
          if (typeof jsonMessageContext === 'string') {
            // If context is already a string, apply color strategy directly
            metaContext = ColorStrategy.console(
              jsonMessageContext,
              level.secondary,
            );
          } else {
            // If context is an object, stringify it first
            metaContext = JSON.stringify(jsonMessageContext);
            if (metaContext.length > 120) {
              metaContext = JSON.stringify(jsonMessageContext, null, 2);
            }
            metaContext = ColorStrategy.console(metaContext, level.secondary);
          }
        }

        messageData.level = level.styledName;
        messageData.timestamp = level.secondary(entry.timestamp);

        // Apply color strategy to message
        if (messageData.message) {
          messageData.message = ColorStrategy.console(
            entry.message,
            level.primary,
          );
        }

        messageData.metadata.context = metaContext;

        if (messageData.metadata.error?.stack) {
          messageData.metadata.error.stack = colorStack(
            messageData.metadata.error.stack,
          );
        }

        if (messageData.metadata.filename) {
          messageData.metadata.filename = level.secondary(
            entry.metadata.filename!,
          );
        }

        return compileMessage(messageData);
      }
    }
  }

  protected _printLog(
    level: LoggerLevel,
    arg1: unknown,
    arg2: Error | unknown,
    arg3: unknown,
  ): void {
    if (this.options.level) {
      const levelSpec = _.get(LOGGER_LEVELS, this.options.level);
      if (!levelSpec) {
        return;
      } else {
        if (level.ordinal > levelSpec.ordinal) {
          return;
        }
      }
    }
    this.__log(this.asLog(level, arg1, arg2, arg3));
  }

  log: LogFunc = (
    arg1?: string | Error | LogContext,
    arg2?: Error | LogContext,
    arg3?: LogContext,
  ) => this._printLog(LEVEL_INFO, arg1, arg2, arg3);
  info: LogFunc = (
    arg1?: string | Error | LogContext,
    arg2?: Error | LogContext,
    arg3?: LogContext,
  ) => this._printLog(LEVEL_INFO, arg1, arg2, arg3);
  trace: LogFunc = (
    arg1?: string | Error | LogContext,
    arg2?: Error | LogContext,
    arg3?: LogContext,
  ) => this._printLog(LEVEL_TRACE, arg1, arg2, arg3);
  debug: LogFunc = (
    arg1?: string | Error | LogContext,
    arg2?: Error | LogContext,
    arg3?: LogContext,
  ) => this._printLog(LEVEL_DEBUG, arg1, arg2, arg3);
  warn: LogFunc = (
    arg1?: string | Error | LogContext,
    arg2?: Error | LogContext,
    arg3?: LogContext,
  ) => this._printLog(LEVEL_WARN, arg1, arg2, arg3);
  error: LogFunc = (
    arg1?: string | Error | LogContext,
    arg2?: Error | LogContext,
    arg3?: LogContext,
  ) => this._printLog(LEVEL_ERROR, arg1, arg2, arg3);
  success: LogFunc = (
    arg1?: string | Error | LogContext,
    arg2?: Error | LogContext,
    arg3?: LogContext,
  ) => this._printLog(LEVEL_SUCCESS, arg1, arg2, arg3);
  critical: LogFunc = (
    arg1?: string | Error | LogContext,
    arg2?: Error | LogContext,
    arg3?: LogContext,
  ) => this._printLog(LEVEL_CRITICAL, arg1, arg2, arg3);
  securityAlert: LogFunc = (
    arg1?: string | Error | LogContext,
    arg2?: Error | LogContext,
    arg3?: LogContext,
  ) => this._printLog(LEVEL_SECURITY_ALERT, arg1, arg2, arg3);
  rainbow: LogFunc = (
    arg1?: string | Error | LogContext,
    arg2?: Error | LogContext,
    arg3?: LogContext,
  ) => this._printLog(LEVEL_RAINBOW, arg1, arg2, arg3);
  setLevel(level: string): Logger {
    this.options.level = level;
    return this;
  }

  /**
   * Adds a plugin to the logger's processing pipeline. If a plugin with the same name already exists,
   * it will be replaced with the new version.
   *
   * Plugins are executed in the order they are added and can modify log entries before they are output.
   * This allows for custom processing like:
   * - Adding additional metadata
   * - Filtering sensitive information
   * - Transforming log formats
   * - Adding tracing or correlation IDs
   *
   * @param plugin The plugin to add, must implement the LoggerPlugin interface with:
   *   - name: Unique identifier for the plugin
   *   - version: Plugin version string
   *   - processEntry: Function that takes and returns a LogEntry
   *
   * @example
   * ```typescript
   * Logger.addPlugin({
   *   name: 'sensitive-data-filter',
   *   version: '1.0.0',
   *   processEntry: (entry) => {
   *     // Remove sensitive data from logs
   *     if (entry.metadata.context?.password) {
   *       entry.metadata.context.password = '[REDACTED]';
   *     }
   *     return entry;
   *   }
   * });
   * ```
   */
  static addPlugin(plugin: LoggerPlugin): void {
    const exists = Logger.plugins.find(p => p.name === plugin.name);
    if (exists) {
      // remove older one and add new one
      Logger.plugins = Logger.plugins.filter(p => p.name !== plugin.name);
    }
    Logger.plugins.push(plugin);
  }

  /**
   * Configures the global console object to use enhanced logging capabilities.
   * This method replaces standard console methods with Logger functionality,
   * providing structured logging, colored output, and additional log levels.
   *
   * @param args Optional Logger instance or LoggerOptions object to configure the console logger
   *             If not provided, defaults to CLI format or format specified in CF_LOGGING_FORMAT env var
   *
   * @example
   * ```typescript
   * // Basic configuration
   * Logger.configureConsole();
   *
   * // Configure with options
   * Logger.configureConsole({
   *   format: 'cli',
   *   prefix: {value: 'my-app', color: 'blue'},
   *   timestamp: 'ISO8601'
   * });
   *
   * // Configure with existing logger instance
   * const logger = new Logger({format: 'json'});
   * Logger.configureConsole(logger);
   * ```
   *
   * After configuration, enhanced console methods are available:
   * - Standard: log, info, warn, error, debug, trace
   * - Additional: success, critical, securityAlert, rainbow
   * - Utility: setLevel
   */
  static configureConsole(args?: Logger | LoggerOptions): void {
    let logger: Logger | undefined;
    if (args) {
      if (args instanceof Logger) {
        logger = args;
      } else if (_.isPlainObject(args)) {
        logger = new Logger(args);
      }
    }
    if (!logger) {
      // TODO environment variables
      logger = new Logger({
        format: (process.env['CF_LOGGING_FORMAT'] ??
          'cli') as LoggerOptions['format'],
      });
    }
    if (!console.__log) {
      console.__log = console.log;
    }
    console.info = logger.info.bind(logger);
    console.log = console.info;
    console.warn = logger.warn.bind(logger);
    console.error = logger.error.bind(logger);
    console.debug = logger.debug.bind(logger);
    console.trace = logger.trace.bind(logger);
    console.success = logger.success.bind(logger);
    console.critical = logger.critical.bind(logger);
    console.securityAlert = logger.securityAlert.bind(logger);
    console.rainbow = logger.rainbow.bind(logger);
    console.setLevel = (level: string) => {
      logger.setLevel(level);
      return console;
    };
  }
}
