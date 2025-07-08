import chalk from 'chalk';
import _ from 'lodash';
import {z} from 'zod';

export const HexColorSchema = z
  .string()
  .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
export type HexColor = z.infer<typeof HexColorSchema>;

export const NAMED_COLORS = {
  /* Reds */
  red_200: '#ffcdd2',
  red_400: '#ef9a9a',
  red_600: '#e57373',
  red_800: '#d32f2f',

  /* Oranges */
  orange_200: '#ffe0b2',
  orange_400: '#ffb74d',
  orange_600: '#fb8c00',
  orange_800: '#ef6c00',

  /* Yellows */
  yellow_200: '#fff9c4',
  yellow_400: '#fff176',
  yellow_600: '#fdd835',
  yellow_800: '#f9a825',

  /* Greens */
  green_200: '#c8e6c9',
  green_400: '#81c784',
  green_600: '#4caf50',
  green_800: '#2e7d32',

  /* Blues */
  blue_200: '#90caf9',
  blue_400: '#64b5f6',
  blue_600: '#1e88e5',
  blue_800: '#1565c0',

  /* Purples */
  purple_200: '#e1bee7',
  purple_400: '#ba68c8',
  purple_600: '#8e24aa',
  purple_800: '#6a1b9a',

  /* Pinks */
  pink_200: '#f8bbd0',
  pink_400: '#f06292',
  pink_600: '#e91e63',
  pink_800: '#ad1457',

  /* Teals */
  teal_200: '#80cbc4',
  teal_400: '#26a69a',
  teal_600: '#00897b',
  teal_800: '#00695c',

  /* Browns */
  brown_200: '#bcaaa4',
  brown_400: '#8d6e63',
  brown_600: '#6d4c41',
  brown_800: '#4e342e',

  /* Grays */
  gray_200: '#eeeeee',
  gray_400: '#bdbdbd',
  gray_600: '#757575',
  gray_800: '#424242',

  /* Indigos */
  indigo_200: '#9fa8da',
  indigo_400: '#5c6bc0',
  indigo_600: '#3949ab',
  indigo_800: '#283593',

  /* Cyans */
  cyan_200: '#80deea',
  cyan_400: '#26c6da',
  cyan_600: '#00acc1',
  cyan_800: '#00838f',
} as const;

export type NamedColor = keyof typeof NAMED_COLORS;

/* SUCCESS */
export const LOGGER_LITE_COLOR_success_main = NAMED_COLORS.green_800;
export const LOGGER_LITE_COLOR_success_light = NAMED_COLORS.green_400;
/* INFO */
export const LOGGER_LITE_COLOR_info_main = NAMED_COLORS.blue_800;
export const LOGGER_LITE_COLOR_info_light = NAMED_COLORS.blue_400;
/* ERROR */
export const LOGGER_LITE_COLOR_error_main = NAMED_COLORS.red_800;
export const LOGGER_LITE_COLOR_error_light = NAMED_COLORS.red_400;
/* WARNING */
export const LOGGER_LITE_COLOR_warning_main = NAMED_COLORS.yellow_800;
export const LOGGER_LITE_COLOR_warning_light = NAMED_COLORS.yellow_400;
/* DEBUG */
export const LOGGER_LITE_COLOR_debug_main = NAMED_COLORS.gray_800;
export const LOGGER_LITE_COLOR_debug_light = NAMED_COLORS.gray_400;
/* TRACE */
export const LOGGER_LITE_COLOR_trace_main = NAMED_COLORS.purple_800;
export const LOGGER_LITE_COLOR_trace_light = NAMED_COLORS.purple_400;

const COLOR_STACK = NAMED_COLORS.red_200;
export const colorStack = chalk.hex(COLOR_STACK);

export const addColor = (
  content: string,
  color: HexColor | NamedColor,
): string => {
  const namedColor = _.get(NAMED_COLORS, color);
  if (namedColor) {
    return chalk.hex(namedColor)(content);
  }
  return chalk.hex(color)(content);
};

/**
 * ANSI color code patterns
 */
const ANSI_COLOR_PATTERNS = {
  // Matches ANSI color codes like \u001b[32m, \u001b[0m, etc.
  ESCAPED_ANSI: /\\u001b\[\d+m/g,
  // Matches raw ANSI color codes like [32m, [0m, etc.
  RAW_ANSI: /\u001b\[\d+m/g,
  // Matches any ANSI escape sequence
  ANY_ANSI: /\u001b\[[\x30-\x3f]*[\x20-\x2f]*[\x40-\x7e]/g,
  // Matches escaped ANSI escape sequences
  ESCAPED_ANY_ANSI: /\\u001b\[[\x30-\x3f]*[\x20-\x2f]*[\x40-\x7e]/g,
};

/**
 * Strips all ANSI color codes from a string
 */
export const stripAnsiColors = (text: string): string => {
  return text
    .replace(ANSI_COLOR_PATTERNS.ESCAPED_ANSI, '')
    .replace(ANSI_COLOR_PATTERNS.RAW_ANSI, '')
    .replace(ANSI_COLOR_PATTERNS.ANY_ANSI, '')
    .replace(ANSI_COLOR_PATTERNS.ESCAPED_ANY_ANSI, '');
};

/**
 * Detects if a string contains ANSI color codes
 */
export const hasAnsiColors = (text: string): boolean => {
  return (
    ANSI_COLOR_PATTERNS.ESCAPED_ANSI.test(text) ||
    ANSI_COLOR_PATTERNS.RAW_ANSI.test(text) ||
    ANSI_COLOR_PATTERNS.ANY_ANSI.test(text) ||
    ANSI_COLOR_PATTERNS.ESCAPED_ANY_ANSI.test(text)
  );
};

/**
 * Converts escaped ANSI codes to raw ANSI codes
 */
export const unescapeAnsiCodes = (text: string): string => {
  return text.replace(/\\u001b/g, '\u001b');
};

/**
 * Converts raw ANSI codes to escaped ANSI codes
 */
export const escapeAnsiCodes = (text: string): string => {
  return text.replace(/\u001b/g, '\\u001b');
};

/**
 * Applies level colors to text, stripping existing colors first
 */
export const applyLevelColors = (
  text: string,
  levelColor: (text: string) => string,
): string => {
  const strippedText = stripAnsiColors(text);
  return levelColor(strippedText);
};

/**
 * Color management strategy for different logging formats
 */
export const ColorStrategy = {
  /**
   * For JSON formats - strip all colors completely
   */
  json: (text: string): string => stripAnsiColors(text),

  /**
   * For console formats - preserve existing colors or apply level colors
   */
  console: (text: string, levelColor: (text: string) => string): string => {
    if (hasAnsiColors(text)) {
      // If text already has colors, unescape them and preserve
      return unescapeAnsiCodes(text);
    } else {
      // If no colors, apply level colors
      return levelColor(text);
    }
  },

  /**
   * For pretty JSON - strip colors but keep the format clean
   */
  prettyJson: (text: string): string => stripAnsiColors(text),
};
