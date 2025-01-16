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
import _ = require('lodash');
import {addColor, colorStack} from '../colors';
import {buildTimestampGenerator} from '../timestamp';

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
  "<%= prefix ? prefix + ' - ' : '' %>[<%= level %>][<%= timestamp %>]<%= metadata.filename ? '[' + metadata.filename + ']' : '' %> <%= message %> <%= metadata.context %><%= (metadata.error && metadata.error.stack) ? '\\n' + metadata.error.stack : '' %>",
);

export type LoggerPlugin = {
  name: string;
  version: string;
  processEntry: (entry: LogEntry) => LogEntry;
};

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
        message = JSON.stringify(context);
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
      case 'json':
        return entry;
      case 'prettyJson':
        return level.primary(JSON.stringify(entry, null, 2));
      case undefined:
      case 'cli':
      case 'browser':
      default: {
        const messageData = _.cloneDeep(entry) as LogEntryData;
        messageData.prefix = this.coloredPrefix;
        const jsonMessageContext = entry.metadata.context as unknown;
        let metaContext = jsonMessageContext
          ? JSON.stringify(jsonMessageContext)
          : '';
        if (metaContext.length > 120) {
          metaContext = JSON.stringify(jsonMessageContext, null, 2);
        }
        messageData.level = level.styledName;
        messageData.timestamp = level.secondary(entry.timestamp);
        if (messageData.message) {
          messageData.message = level.primary(entry.message);
        }
        metaContext = level.secondary(metaContext);
        messageData.metadata.context = metaContext;
        if (messageData.metadata.error?.stack) {
          messageData.metadata.error.stack = colorStack(
            messageData.metadata.error.stack,
          );
        }
        if (messageData.metadata.filename) {
          messageData.metadata.filename = level.secondary(
            messageData.metadata.filename,
          );
        }
        // Not sure if these are actually different... will see if chalk works in the browser
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
   * Order matters.
   * @param plugin
   */
  static addPlugin(plugin: LoggerPlugin): void {
    const exists = Logger.plugins.find(p => p.name === plugin.name);
    if (exists) {
      // remove older one and add new one
      Logger.plugins = Logger.plugins.filter(p => p.name !== plugin.name);
    }
    Logger.plugins.push(plugin);
  }

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
      console.__log = console.log
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
