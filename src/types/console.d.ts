// types/console.d.ts
declare global {
  interface Console {
    success(message?: unknown, ...optionalParams: unknown[]): void;
    critical(message?: unknown, ...optionalParams: unknown[]): void;
    securityAlert(message?: unknown, ...optionalParams: unknown[]): void;
    rainbow(message?: unknown, ...optionalParams: unknown[]): void;
    // setLevel(level: LoggerLiteLevelName): Console;
    // __log?: LoggerLiteOptions;
  }
}

export {}; // Ensure this file is treated as a module
