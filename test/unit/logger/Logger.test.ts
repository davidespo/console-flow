import {FlowLogger} from '../../../src/index';
import {Logger} from '../../../src/logger/Logger';

describe('Logger', () => {
  let logger: Logger;
  let consoleCapture: {output: string[]; restore: () => void};

  beforeEach(() => {
    consoleCapture = (global as any).testUtils.captureConsoleOutput();
    logger = new FlowLogger({
      format: 'json',
      prefix: {
        value: 'test-logger',
        color: 'blue_800',
      },
    });
  });

  afterEach(() => {
    consoleCapture.restore();
  });

  describe('basic logging methods', () => {
    it('should log messages with all levels', () => {
      const testData = {foo: 'bar', baz: 3.1415, qux: true};

      logger.log('Hello, world!', testData);
      logger.info('Hello, world!', testData);
      logger.success('Hello, world!', testData);
      logger.debug('Hello, world!', testData);
      logger.trace('Hello, world!', testData);
      logger.warn('Hello, world!', testData);
      logger.error('Hello, world!', testData);
      logger.critical('Hello, world!', testData);
      logger.securityAlert('Hello, world!', testData);
      logger.rainbow('Hello, world!', testData);

      expect(consoleCapture.output).toHaveLength(10);

      // Verify each log entry contains expected data
      consoleCapture.output.forEach((output: string) => {
        const parsed = JSON.parse(output);
        expect(parsed).toHaveProperty('level');
        expect(parsed).toHaveProperty('timestamp');
        expect(parsed).toHaveProperty('message', 'Hello, world!');
        expect(parsed).toHaveProperty('metadata');
        expect(parsed.metadata).toHaveProperty('context');
        expect(parsed.metadata.context).toEqual(testData);
      });
    });

    it('should handle nested objects in context', () => {
      const nestedData = {
        foo: 'bar',
        baz: 3.1415,
        qux: true,
        nested: {
          foo: 'bar',
          baz: 3.1415,
          qux: true,
          nested: {foo: 'bar', baz: 3.1415, qux: true},
        },
      };

      logger.log('Hello, world!', nestedData);

      expect(consoleCapture.output).toHaveLength(1);
      const parsed = JSON.parse(consoleCapture.output[0]);
      expect(parsed.metadata.context).toEqual(nestedData);
    });

    it('should handle errors', () => {
      const error = new Error('Test error');
      error.stack = 'Error: Test error\n    at test.ts:10:5';

      logger.error('Error occurred', error);

      expect(consoleCapture.output).toHaveLength(1);
      const parsed = JSON.parse(consoleCapture.output[0]);
      expect(parsed.metadata.error).toBeDefined();
      expect(parsed.metadata.error.name).toBe('Error');
      expect(parsed.metadata.error.stack).toBe(error.stack);
    });

    it('should handle string context', () => {
      logger.info('Message', 'string context');

      expect(consoleCapture.output).toHaveLength(1);
      const parsed = JSON.parse(consoleCapture.output[0]);
      expect(parsed.metadata.context).toBe('string context');
    });

    it('should handle undefined context', () => {
      logger.info('Message');

      expect(consoleCapture.output).toHaveLength(1);
      const parsed = JSON.parse(consoleCapture.output[0]);
      expect(parsed.metadata.context).toBeUndefined();
    });
  });

  describe('format options', () => {
    it('should format as JSON when format is json', () => {
      const jsonLogger = new FlowLogger({format: 'json'});
      jsonLogger.info('Test message', {data: 'value'});

      expect(consoleCapture.output).toHaveLength(1);
      const parsed = JSON.parse(consoleCapture.output[0]);
      expect(parsed).toHaveProperty('level');
      expect(parsed).toHaveProperty('timestamp');
      expect(parsed).toHaveProperty('message');
      expect(parsed).toHaveProperty('metadata');
    });

    it('should format as pretty JSON when format is prettyJson', () => {
      const prettyLogger = new FlowLogger({format: 'prettyJson'});
      prettyLogger.info('Test message', {data: 'value'});

      expect(consoleCapture.output).toHaveLength(1);
      // Pretty JSON should be colored, so we can't easily parse it
      expect(consoleCapture.output[0]).toContain('Test message');
      expect(consoleCapture.output[0]).toContain('data');
    });

    it('should format as CLI when format is cli', () => {
      const cliLogger = new FlowLogger({format: 'cli'});
      cliLogger.info('Test message', {data: 'value'});

      expect(consoleCapture.output).toHaveLength(1);
      expect(consoleCapture.output[0]).toContain('Test message');
    });
  });

  describe('prefix configuration', () => {
    it('should include prefix in log entries', () => {
      const prefixedLogger = new FlowLogger({
        format: 'json',
        prefix: {value: 'my-app'},
      });

      prefixedLogger.info('Test message');

      expect(consoleCapture.output).toHaveLength(1);
      const parsed = JSON.parse(consoleCapture.output[0]);
      expect(parsed.metadata.scope).toEqual({value: 'my-app'});
    });

    it('should handle colored prefix', () => {
      const coloredLogger = new FlowLogger({
        format: 'cli',
        prefix: {value: 'my-app', color: 'red'},
      });

      coloredLogger.info('Test message');

      expect(consoleCapture.output).toHaveLength(1);
      expect(consoleCapture.output[0]).toContain('my-app');
    });
  });

  describe('timestamp configuration', () => {
    it('should use RFC3339 timestamp format', () => {
      const rfcLogger = new FlowLogger({
        format: 'json',
        timestamp: 'RFC3339',
      });

      rfcLogger.info('Test message');

      expect(consoleCapture.output).toHaveLength(1);
      const parsed = JSON.parse(consoleCapture.output[0]);
      expect(parsed.timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      );
    });
  });

  describe('level filtering', () => {
    it('should respect setLevel configuration', () => {
      const filteredLogger = new FlowLogger({
        format: 'json',
        level: 'WARN',
      });

      filteredLogger.debug('Debug message'); // Should not appear
      filteredLogger.info('Info message'); // Should not appear
      filteredLogger.warn('Warn message'); // Should appear
      filteredLogger.error('Error message'); // Should appear

      expect(consoleCapture.output).toHaveLength(2);

      const outputs = consoleCapture.output.map(o => JSON.parse(o));
      expect(outputs[0].level).toBe('WARN');
      expect(outputs[1].level).toBe('ERROR');
    });
  });

  describe('rainbow logging', () => {
    it('should handle rainbow logging with emojis', () => {
      const rainbowLogger = new FlowLogger({
        format: 'cli',
        prefix: {value: 'test-app'},
      });

      rainbowLogger.rainbow('🎉 1 million users milestone reached! 🎉');

      expect(consoleCapture.output).toHaveLength(1);
      const output = consoleCapture.output[0].trim();
      // Strip ANSI color codes
      const outputStripped = output.replace(/\u001b\[[0-9;]*m/g, '');

      // Should contain the message and emojis
      expect(outputStripped).toContain('1 million users milestone reached!');
      expect(outputStripped).toContain('🎉');

      // Should be a rainbow level log
      expect(outputStripped).toContain('🌈🦄🎉');
    });

    it('should handle rainbow logging with complex unicode characters', () => {
      const rainbowLogger = new FlowLogger({
        format: 'cli',
        prefix: {value: 'test-app'},
      });

      rainbowLogger.rainbow('🌈🦄🎉 Special rainbow message! 🎉🦄🌈');

      expect(consoleCapture.output).toHaveLength(1);
      const output = consoleCapture.output[0].trim();
      // Strip ANSI color codes
      const outputStripped = output.replace(/\u001b\[[0-9;]*m/g, '');

      // Should contain the message and emojis
      expect(outputStripped).toContain('Special rainbow message!');
      expect(outputStripped).toContain('🌈');
      expect(outputStripped).toContain('🦄');
      expect(outputStripped).toContain('🎉');
    });
  });
});
