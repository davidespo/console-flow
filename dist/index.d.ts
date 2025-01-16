import { z } from 'zod';

declare const LoggerOptionsSchema: z.ZodObject<{
    prefix: z.ZodOptional<z.ZodObject<{
        value: z.ZodString;
        /**
         * Can be a named color or a hex color
         */
        color: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        value: string;
        color?: string | undefined;
    }, {
        value: string;
        color?: string | undefined;
    }>>;
    /**
     * Defaults to INFO
     */
    filename: z.ZodOptional<z.ZodString>;
    level: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"ISO8601">, z.ZodLiteral<"locale">, z.ZodLiteral<"unix">, z.ZodString, z.ZodBoolean]>>;
    format: z.ZodOptional<z.ZodEnum<["gcp", "cloud", "json", "prettyJson", "cli", "browser"]>>;
}, "strip", z.ZodTypeAny, {
    prefix?: {
        value: string;
        color?: string | undefined;
    } | undefined;
    filename?: string | undefined;
    level?: string | undefined;
    timestamp?: string | boolean | undefined;
    format?: "gcp" | "cloud" | "json" | "prettyJson" | "cli" | "browser" | undefined;
}, {
    prefix?: {
        value: string;
        color?: string | undefined;
    } | undefined;
    filename?: string | undefined;
    level?: string | undefined;
    timestamp?: string | boolean | undefined;
    format?: "gcp" | "cloud" | "json" | "prettyJson" | "cli" | "browser" | undefined;
}>;
type LoggerOptions = z.infer<typeof LoggerOptionsSchema>;

type LoggerLevel = {
    readonly ordinal: number;
    readonly key: string;
    readonly name: string;
    readonly styledName: string;
    readonly primary: (text: string) => string;
    readonly secondary: (text: string) => string;
};

type LogContext = unknown;
type LogFunc = (arg1?: string | Error | LogContext, arg2?: Error | LogContext, arg3?: LogContext) => void;
type LogEntry = {
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
type LoggerPlugin = {
    name: string;
    version: string;
    processEntry: (entry: LogEntry) => LogEntry;
};
declare class Logger {
    private readonly options;
    private static plugins;
    private readonly coloredPrefix;
    private readonly getTimestamp;
    private readonly __log;
    constructor(options: LoggerOptions);
    protected _asJson(level: string, message: string | undefined, error: Error | undefined, context: unknown | undefined): LogEntry;
    asJson(level: string, arg1: unknown, arg2: Error | unknown, arg3: unknown): LogEntry;
    asLog(level: LoggerLevel, arg1: unknown, arg2: Error | unknown, arg3: unknown): string | LogEntry;
    protected _printLog(level: LoggerLevel, arg1: unknown, arg2: Error | unknown, arg3: unknown): void;
    log: LogFunc;
    info: LogFunc;
    trace: LogFunc;
    debug: LogFunc;
    warn: LogFunc;
    error: LogFunc;
    success: LogFunc;
    critical: LogFunc;
    securityAlert: LogFunc;
    rainbow: LogFunc;
    setLevel(level: string): Logger;
    /**
   * Order matters.
   * @param plugin
   */
    static addPlugin(plugin: LoggerPlugin): void;
    static configureConsole(args?: Logger | LoggerOptions): void;
}

declare const FlowLogger: typeof Logger;

export { FlowLogger };
