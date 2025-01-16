"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  FlowLogger: () => FlowLogger
});
module.exports = __toCommonJS(index_exports);

// src/levels.ts
var import_chalk2 = __toESM(require("chalk"));

// src/colors.ts
var import_chalk = __toESM(require("chalk"));
var import_zod = require("zod");
var _ = require("lodash");
var HexColorSchema = import_zod.z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
var NAMED_COLORS = {
  /* Reds */
  red_200: "#ffcdd2",
  red_400: "#ef9a9a",
  red_600: "#e57373",
  red_800: "#d32f2f",
  /* Oranges */
  orange_200: "#ffe0b2",
  orange_400: "#ffb74d",
  orange_600: "#fb8c00",
  orange_800: "#ef6c00",
  /* Yellows */
  yellow_200: "#fff9c4",
  yellow_400: "#fff176",
  yellow_600: "#fdd835",
  yellow_800: "#f9a825",
  /* Greens */
  green_200: "#c8e6c9",
  green_400: "#81c784",
  green_600: "#4caf50",
  green_800: "#2e7d32",
  /* Blues */
  blue_200: "#90caf9",
  blue_400: "#64b5f6",
  blue_600: "#1e88e5",
  blue_800: "#1565c0",
  /* Purples */
  purple_200: "#e1bee7",
  purple_400: "#ba68c8",
  purple_600: "#8e24aa",
  purple_800: "#6a1b9a",
  /* Pinks */
  pink_200: "#f8bbd0",
  pink_400: "#f06292",
  pink_600: "#e91e63",
  pink_800: "#ad1457",
  /* Teals */
  teal_200: "#80cbc4",
  teal_400: "#26a69a",
  teal_600: "#00897b",
  teal_800: "#00695c",
  /* Browns */
  brown_200: "#bcaaa4",
  brown_400: "#8d6e63",
  brown_600: "#6d4c41",
  brown_800: "#4e342e",
  /* Grays */
  gray_200: "#eeeeee",
  gray_400: "#bdbdbd",
  gray_600: "#757575",
  gray_800: "#424242",
  /* Indigos */
  indigo_200: "#9fa8da",
  indigo_400: "#5c6bc0",
  indigo_600: "#3949ab",
  indigo_800: "#283593",
  /* Cyans */
  cyan_200: "#80deea",
  cyan_400: "#26c6da",
  cyan_600: "#00acc1",
  cyan_800: "#00838f"
};
var LOGGER_LITE_COLOR_success_main = NAMED_COLORS.green_800;
var LOGGER_LITE_COLOR_success_light = NAMED_COLORS.green_400;
var LOGGER_LITE_COLOR_info_main = NAMED_COLORS.blue_800;
var LOGGER_LITE_COLOR_info_light = NAMED_COLORS.blue_400;
var LOGGER_LITE_COLOR_error_main = NAMED_COLORS.red_800;
var LOGGER_LITE_COLOR_error_light = NAMED_COLORS.red_400;
var LOGGER_LITE_COLOR_warning_main = NAMED_COLORS.yellow_800;
var LOGGER_LITE_COLOR_warning_light = NAMED_COLORS.yellow_400;
var LOGGER_LITE_COLOR_debug_main = NAMED_COLORS.gray_800;
var LOGGER_LITE_COLOR_debug_light = NAMED_COLORS.gray_400;
var LOGGER_LITE_COLOR_trace_main = NAMED_COLORS.purple_800;
var LOGGER_LITE_COLOR_trace_light = NAMED_COLORS.purple_400;
var COLOR_STACK = NAMED_COLORS.red_200;
var colorStack = import_chalk.default.hex(COLOR_STACK);
var addColor = (content, color) => {
  const namedColor = _.get(NAMED_COLORS, color);
  if (namedColor) {
    return import_chalk.default.hex(namedColor)(content);
  }
  return import_chalk.default.hex(color)(content);
};

// src/levels.ts
var toLevel = (ordinal, name, color, lightColor, key) => ({
  ordinal,
  name,
  key: key || name.toUpperCase(),
  primary: import_chalk2.default.hex(color),
  secondary: import_chalk2.default.hex(lightColor),
  styledName: import_chalk2.default.hex(lightColor)(name)
});
var loggerLevelOrdinal = 0;
var LEVEL_SECURITY_ALERT_KEY = "SECURITY";
var LEVEL_SECURITY_ALERT = toLevel(
  loggerLevelOrdinal++,
  LEVEL_SECURITY_ALERT_KEY,
  LOGGER_LITE_COLOR_error_main,
  LOGGER_LITE_COLOR_error_light
);
var LEVEL_CRITICAL_KEY = "CRITICAL";
var LEVEL_CRITICAL = toLevel(
  loggerLevelOrdinal++,
  LEVEL_CRITICAL_KEY,
  LOGGER_LITE_COLOR_error_main,
  LOGGER_LITE_COLOR_error_light
);
var LEVEL_ERROR_KEY = "ERROR";
var LEVEL_ERROR = toLevel(
  loggerLevelOrdinal++,
  LEVEL_ERROR_KEY,
  LOGGER_LITE_COLOR_error_main,
  LOGGER_LITE_COLOR_error_light
);
var LEVEL_WARN_KEY = "WARN";
var LEVEL_WARN = toLevel(
  loggerLevelOrdinal++,
  LEVEL_WARN_KEY,
  LOGGER_LITE_COLOR_warning_main,
  LOGGER_LITE_COLOR_warning_light
);
var LEVEL_SUCCESS_KEY = "SUCCESS";
var LEVEL_SUCCESS = toLevel(
  loggerLevelOrdinal++,
  LEVEL_SUCCESS_KEY,
  LOGGER_LITE_COLOR_success_main,
  LOGGER_LITE_COLOR_success_light
);
var LEVEL_INFO_KEY = "INFO";
var LEVEL_INFO = toLevel(
  loggerLevelOrdinal++,
  LEVEL_INFO_KEY,
  LOGGER_LITE_COLOR_info_main,
  LOGGER_LITE_COLOR_info_light
);
var LEVEL_RAINBOW_KEY = "RAINBOW";
var LEVEL_RAINBOW = {
  ordinal: loggerLevelOrdinal++,
  key: LEVEL_RAINBOW_KEY,
  name: "\u{1F308}\u{1F984}\u{1F389}",
  primary: (text) => {
    const colors = [
      import_chalk2.default.red,
      import_chalk2.default.hex("#FFA500"),
      import_chalk2.default.yellow,
      import_chalk2.default.green,
      import_chalk2.default.blue,
      import_chalk2.default.hex("#4B0082"),
      import_chalk2.default.hex("#8F00FF")
    ];
    return text.split("").map((char, i) => colors[i % colors.length](char)).join("");
  },
  secondary: (text) => text,
  styledName: "\u{1F308}\u{1F984}\u{1F389}"
};
var LEVEL_DEBUG_KEY = "DEBUG";
var LEVEL_DEBUG = toLevel(
  loggerLevelOrdinal++,
  LEVEL_DEBUG_KEY,
  LOGGER_LITE_COLOR_debug_main,
  LOGGER_LITE_COLOR_debug_light
);
var LEVEL_TRACE_KEY = "TRACE";
var LEVEL_TRACE = toLevel(
  loggerLevelOrdinal++,
  LEVEL_TRACE_KEY,
  LOGGER_LITE_COLOR_trace_main,
  LOGGER_LITE_COLOR_trace_light
);
var LEVEL_ANY_KEY = "ANY";
var LOGGER_LEVELS = {
  [LEVEL_SECURITY_ALERT_KEY]: LEVEL_SECURITY_ALERT,
  [LEVEL_CRITICAL_KEY]: LEVEL_CRITICAL,
  [LEVEL_ERROR_KEY]: LEVEL_ERROR,
  [LEVEL_WARN_KEY]: LEVEL_WARN,
  [LEVEL_SUCCESS_KEY]: LEVEL_SUCCESS,
  [LEVEL_INFO_KEY]: LEVEL_INFO,
  [LEVEL_DEBUG_KEY]: LEVEL_DEBUG,
  [LEVEL_TRACE_KEY]: LEVEL_TRACE,
  [LEVEL_RAINBOW_KEY]: LEVEL_RAINBOW,
  [LEVEL_ANY_KEY]: LEVEL_TRACE
};

// src/timestamp.ts
var import_moment = __toESM(require("moment"));
var import_zod2 = require("zod");
var TimestampOptionSchema = import_zod2.z.union([
  import_zod2.z.literal("ISO8601"),
  import_zod2.z.literal("locale"),
  import_zod2.z.literal("unix"),
  import_zod2.z.string(),
  import_zod2.z.boolean()
]);
var buildTimestampGenerator = (timestamp) => {
  switch (timestamp) {
    case void 0:
    case "ISO8601":
      return () => (/* @__PURE__ */ new Date()).toISOString().substring(0, 19);
    case "unix":
      return () => Date.now().toString();
    case "locale":
      return () => (/* @__PURE__ */ new Date()).toLocaleString();
    case true:
      return () => (/* @__PURE__ */ new Date()).toISOString().substring(11, 19);
    case false:
      return () => "";
    default:
      return () => (0, import_moment.default)().format(timestamp);
  }
};

// src/logger/Logger.ts
var _2 = require("lodash");
var compileMessage = _2.template(
  "<%= prefix ? prefix + ' - ' : '' %>[<%= level %>][<%= timestamp %>]<%= metadata.filename ? '[' + metadata.filename + ']' : '' %> <%= message %> <%= metadata.context %><%= (metadata.error && metadata.error.stack) ? '\\n' + metadata.error.stack : '' %>"
);
var Logger = class _Logger {
  constructor(options) {
    this.options = options;
    this.coloredPrefix = !options.prefix ? "" : options.prefix?.color ? addColor(options.prefix.value, options.prefix.color) : options.prefix.value;
    this.getTimestamp = buildTimestampGenerator(options.timestamp);
  }
  static plugins = [];
  coloredPrefix;
  getTimestamp;
  __log = console.__log ?? console.log;
  _asJson(level, message, error, context) {
    if (!message) {
      if (error) {
        message = error.message;
      } else if (typeof context !== "undefined") {
        message = JSON.stringify(context);
      } else {
        message = "\n";
      }
    }
    let errorMetadata = void 0;
    if (error) {
      const { stack, name, ...errorCustomProperties } = error;
      errorMetadata = { name, stack, ...errorCustomProperties };
    }
    const entry = {
      level,
      timestamp: this.getTimestamp(),
      message,
      metadata: {
        context,
        scope: this.options.prefix,
        filename: this.options.filename,
        error: errorMetadata
      }
    };
    return _Logger.plugins.reduce(
      (acc, plugin) => plugin.processEntry(acc),
      entry
    );
  }
  asJson(level, arg1, arg2, arg3) {
    if (typeof arg1 === "string") {
      if (arg2 instanceof Error) {
        return this._asJson(level, arg1, arg2, arg3);
      } else {
        return this._asJson(level, arg1, void 0, arg2);
      }
    } else if (arg1 instanceof Error) {
      return this._asJson(level, void 0, arg1, arg2);
    } else if (typeof arg1 === "undefined") {
      return this._asJson(level, void 0, void 0, arg1);
    } else {
      return this._asJson(level, void 0, void 0, arg1);
    }
  }
  asLog(level, arg1, arg2, arg3) {
    const entry = this.asJson(level.key, arg1, arg2, arg3);
    switch (this.options.format) {
      case "json":
        return entry;
      case "prettyJson":
        return level.primary(JSON.stringify(entry, null, 2));
      case void 0:
      case "cli":
      case "browser":
      default: {
        const messageData = _2.cloneDeep(entry);
        messageData.prefix = this.coloredPrefix;
        const jsonMessageContext = entry.metadata.context;
        let metaContext = jsonMessageContext ? JSON.stringify(jsonMessageContext) : "";
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
            messageData.metadata.error.stack
          );
        }
        if (messageData.metadata.filename) {
          messageData.metadata.filename = level.secondary(
            messageData.metadata.filename
          );
        }
        return compileMessage(messageData);
      }
    }
  }
  _printLog(level, arg1, arg2, arg3) {
    if (this.options.level) {
      const levelSpec = _2.get(LOGGER_LEVELS, this.options.level);
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
  log = (arg1, arg2, arg3) => this._printLog(LEVEL_INFO, arg1, arg2, arg3);
  info = (arg1, arg2, arg3) => this._printLog(LEVEL_INFO, arg1, arg2, arg3);
  trace = (arg1, arg2, arg3) => this._printLog(LEVEL_TRACE, arg1, arg2, arg3);
  debug = (arg1, arg2, arg3) => this._printLog(LEVEL_DEBUG, arg1, arg2, arg3);
  warn = (arg1, arg2, arg3) => this._printLog(LEVEL_WARN, arg1, arg2, arg3);
  error = (arg1, arg2, arg3) => this._printLog(LEVEL_ERROR, arg1, arg2, arg3);
  success = (arg1, arg2, arg3) => this._printLog(LEVEL_SUCCESS, arg1, arg2, arg3);
  critical = (arg1, arg2, arg3) => this._printLog(LEVEL_CRITICAL, arg1, arg2, arg3);
  securityAlert = (arg1, arg2, arg3) => this._printLog(LEVEL_SECURITY_ALERT, arg1, arg2, arg3);
  rainbow = (arg1, arg2, arg3) => this._printLog(LEVEL_RAINBOW, arg1, arg2, arg3);
  setLevel(level) {
    this.options.level = level;
    return this;
  }
  /**
  * Order matters.
  * @param plugin
  */
  static addPlugin(plugin) {
    const exists = _Logger.plugins.find((p) => p.name === plugin.name);
    if (exists) {
      _Logger.plugins = _Logger.plugins.filter((p) => p.name !== plugin.name);
    }
    _Logger.plugins.push(plugin);
  }
  static configureConsole(args) {
    let logger;
    if (args) {
      if (args instanceof _Logger) {
        logger = args;
      } else if (_2.isPlainObject(args)) {
        logger = new _Logger(args);
      }
    }
    if (!logger) {
      logger = new _Logger({
        format: process.env["CF_LOGGING_FORMAT"] ?? "cli"
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
    console.setLevel = (level) => {
      logger.setLevel(level);
      return console;
    };
  }
};

// src/index.ts
var FlowLogger = Logger;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FlowLogger
});
