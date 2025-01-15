import chalk from 'chalk';
import {
  LOGGER_LITE_COLOR_debug_light,
  LOGGER_LITE_COLOR_debug_main,
  LOGGER_LITE_COLOR_error_light,
  LOGGER_LITE_COLOR_error_main,
  LOGGER_LITE_COLOR_info_light,
  LOGGER_LITE_COLOR_info_main,
  LOGGER_LITE_COLOR_success_light,
  LOGGER_LITE_COLOR_success_main,
  LOGGER_LITE_COLOR_trace_light,
  LOGGER_LITE_COLOR_trace_main,
  LOGGER_LITE_COLOR_warning_light,
  LOGGER_LITE_COLOR_warning_main,
} from './colors';

export type LoggerLevel = {
  readonly ordinal: number;
  readonly key: string;
  readonly name: string;
  readonly styledName: string;
  readonly primary: (text: string) => string;
  readonly secondary: (text: string) => string;
};
const toLevel = (
  ordinal: number,
  name: string,
  color: string,
  lightColor: string,
  key?: string,
): LoggerLevel => ({
  ordinal,
  name,
  key: key || name.toUpperCase(),
  primary: chalk.hex(color),
  secondary: chalk.hex(lightColor),
  styledName: chalk.hex(lightColor)(name),
});

let loggerLevelOrdinal = 0;

export const LEVEL_SECURITY_ALERT_KEY = 'SECURITY';
export const LEVEL_SECURITY_ALERT = toLevel(
  loggerLevelOrdinal++,
  LEVEL_SECURITY_ALERT_KEY,
  LOGGER_LITE_COLOR_error_main,
  LOGGER_LITE_COLOR_error_light,
);
export const LEVEL_CRITICAL_KEY = 'CRITICAL';
export const LEVEL_CRITICAL = toLevel(
  loggerLevelOrdinal++,
  LEVEL_CRITICAL_KEY,
  LOGGER_LITE_COLOR_error_main,
  LOGGER_LITE_COLOR_error_light,
);
export const LEVEL_ERROR_KEY = 'ERROR';
export const LEVEL_ERROR = toLevel(
  loggerLevelOrdinal++,
  LEVEL_ERROR_KEY,
  LOGGER_LITE_COLOR_error_main,
  LOGGER_LITE_COLOR_error_light,
);
export const LEVEL_WARN_KEY = 'WARN';
export const LEVEL_WARN = toLevel(
  loggerLevelOrdinal++,
  LEVEL_WARN_KEY,
  LOGGER_LITE_COLOR_warning_main,
  LOGGER_LITE_COLOR_warning_light,
);
export const LEVEL_SUCCESS_KEY = 'SUCCESS';
export const LEVEL_SUCCESS = toLevel(
  loggerLevelOrdinal++,
  LEVEL_SUCCESS_KEY,
  LOGGER_LITE_COLOR_success_main,
  LOGGER_LITE_COLOR_success_light,
);
export const LEVEL_INFO_KEY = 'INFO';
export const LEVEL_INFO = toLevel(
  loggerLevelOrdinal++,
  LEVEL_INFO_KEY,
  LOGGER_LITE_COLOR_info_main,
  LOGGER_LITE_COLOR_info_light,
);
export const LEVEL_RAINBOW_KEY = 'RAINBOW';
export const LEVEL_RAINBOW: LoggerLevel = {
  ordinal: loggerLevelOrdinal++,
  key: LEVEL_RAINBOW_KEY,
  name: '🌈🦄🎉',
  primary: (text: string) => {
    const colors = [
      chalk.red,
      chalk.hex('#FFA500'),
      chalk.yellow,
      chalk.green,
      chalk.blue,
      chalk.hex('#4B0082'),
      chalk.hex('#8F00FF'),
    ];
    return text
      .split('')
      .map((char, i) => colors[i % colors.length](char))
      .join('');
  },
  secondary: (text: string) => text,
  styledName: '🌈🦄🎉',
};
export const LEVEL_DEBUG_KEY = 'DEBUG';
export const LEVEL_DEBUG = toLevel(
  loggerLevelOrdinal++,
  LEVEL_DEBUG_KEY,
  LOGGER_LITE_COLOR_debug_main,
  LOGGER_LITE_COLOR_debug_light,
);
export const LEVEL_TRACE_KEY = 'TRACE';
export const LEVEL_TRACE = toLevel(
  loggerLevelOrdinal++,
  LEVEL_TRACE_KEY,
  LOGGER_LITE_COLOR_trace_main,
  LOGGER_LITE_COLOR_trace_light,
);
export const LEVEL_ANY_KEY = 'ANY';
export const LEVEL_DEFAULT_KEY = LEVEL_ANY_KEY;

export const LOGGER_LEVELS = {
  [LEVEL_SECURITY_ALERT_KEY]: LEVEL_SECURITY_ALERT,
  [LEVEL_CRITICAL_KEY]: LEVEL_CRITICAL,
  [LEVEL_ERROR_KEY]: LEVEL_ERROR,
  [LEVEL_WARN_KEY]: LEVEL_WARN,
  [LEVEL_SUCCESS_KEY]: LEVEL_SUCCESS,
  [LEVEL_INFO_KEY]: LEVEL_INFO,
  [LEVEL_DEBUG_KEY]: LEVEL_DEBUG,
  [LEVEL_TRACE_KEY]: LEVEL_TRACE,
  [LEVEL_RAINBOW_KEY]: LEVEL_RAINBOW,
  [LEVEL_ANY_KEY]: LEVEL_TRACE,
} as const;
export type LoggerLiteLevelName = keyof typeof LOGGER_LEVELS;
