// Jest setup file for global test configuration

// Mock console methods to capture output during tests
const originalConsole = {
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
  debug: console.debug,
};

// Global test utilities
(global as any).testUtils = {
  captureConsoleOutput: () => {
    const output: string[] = [];

    console.log = (...args: any[]) => {
      output.push(args.join(' '));
      originalConsole.log(...args);
    };

    console.info = (...args: any[]) => {
      output.push(args.join(' '));
      originalConsole.info(...args);
    };

    console.warn = (...args: any[]) => {
      output.push(args.join(' '));
      originalConsole.warn(...args);
    };

    console.error = (...args: any[]) => {
      output.push(args.join(' '));
      originalConsole.error(...args);
    };

    console.debug = (...args: any[]) => {
      output.push(args.join(' '));
      originalConsole.debug(...args);
    };

    return {
      output,
      restore: () => {
        console.log = originalConsole.log;
        console.info = originalConsole.info;
        console.warn = originalConsole.warn;
        console.error = originalConsole.error;
        console.debug = originalConsole.debug;
      },
    };
  },
};
