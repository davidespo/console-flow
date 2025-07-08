import {
  LOGGER_LEVELS,
  LEVEL_SECURITY_ALERT,
  LEVEL_CRITICAL,
  LEVEL_ERROR,
  LEVEL_WARN,
  LEVEL_SUCCESS,
  LEVEL_INFO,
  LEVEL_DEBUG,
  LEVEL_TRACE,
  LEVEL_RAINBOW,
  LoggerLevel,
  LoggerLiteLevelName,
} from '../../src/levels';

describe('Levels', () => {
  describe('LOGGER_LEVELS', () => {
    it('should contain all expected log levels', () => {
      expect(LOGGER_LEVELS).toHaveProperty('SECURITY');
      expect(LOGGER_LEVELS).toHaveProperty('CRITICAL');
      expect(LOGGER_LEVELS).toHaveProperty('ERROR');
      expect(LOGGER_LEVELS).toHaveProperty('WARN');
      expect(LOGGER_LEVELS).toHaveProperty('SUCCESS');
      expect(LOGGER_LEVELS).toHaveProperty('INFO');
      expect(LOGGER_LEVELS).toHaveProperty('DEBUG');
      expect(LOGGER_LEVELS).toHaveProperty('TRACE');
      expect(LOGGER_LEVELS).toHaveProperty('RAINBOW');
      expect(LOGGER_LEVELS).toHaveProperty('ANY');
    });

    it('should have valid ordinal values', () => {
      const levels = Object.values(LOGGER_LEVELS);
      levels.forEach(level => {
        expect(typeof level.ordinal).toBe('number');
        expect(level.ordinal).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('Individual Level Objects', () => {
    const testLevel = (
      level: LoggerLevel,
      expectedKey: string,
      expectedName: string,
    ) => {
      it(`should have correct properties for ${expectedKey}`, () => {
        expect(level).toHaveProperty('ordinal');
        expect(level).toHaveProperty('key', expectedKey);
        expect(level).toHaveProperty('name');
        expect(level).toHaveProperty('styledName');
        expect(level).toHaveProperty('primary');
        expect(level).toHaveProperty('secondary');
        expect(typeof level.primary).toBe('function');
        expect(typeof level.secondary).toBe('function');
      });
    };

    testLevel(LEVEL_SECURITY_ALERT, 'SECURITY', 'SECURITY');
    testLevel(LEVEL_CRITICAL, 'CRITICAL', 'CRITICAL');
    testLevel(LEVEL_ERROR, 'ERROR', 'ERROR');
    testLevel(LEVEL_WARN, 'WARN', 'WARN');
    testLevel(LEVEL_SUCCESS, 'SUCCESS', 'SUCCESS');
    testLevel(LEVEL_INFO, 'INFO', 'INFO');
    testLevel(LEVEL_DEBUG, 'DEBUG', 'DEBUG');
    testLevel(LEVEL_TRACE, 'TRACE', 'TRACE');
  });

  describe('RAINBOW level', () => {
    it('should have special rainbow styling', () => {
      expect(LEVEL_RAINBOW.key).toBe('RAINBOW');
      expect(LEVEL_RAINBOW.name).toBe('🌈🦄🎉');
      expect(LEVEL_RAINBOW.styledName).toBe('🌈🦄🎉');
    });

    it('should apply rainbow colors to text', () => {
      const result = LEVEL_RAINBOW.primary('Hello');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      // Rainbow function should return a string (might be colored)
      expect(result).toBeDefined();
    });

    it('should handle secondary styling', () => {
      const result = LEVEL_RAINBOW.secondary('Hello');
      expect(result).toBe('Hello'); // Secondary should be plain text
    });
  });

  describe('Level ordering', () => {
    it('should have SECURITY as highest priority', () => {
      expect(LEVEL_SECURITY_ALERT.ordinal).toBe(0);
    });

    it('should have CRITICAL as second highest priority', () => {
      expect(LEVEL_CRITICAL.ordinal).toBe(1);
    });

    it('should have ERROR as third highest priority', () => {
      expect(LEVEL_ERROR.ordinal).toBe(2);
    });

    it('should have TRACE as lowest priority', () => {
      expect(LEVEL_TRACE.ordinal).toBe(8);
    });

    it('should have ANY level pointing to TRACE', () => {
      expect(LOGGER_LEVELS.ANY).toBe(LEVEL_TRACE);
    });
  });

  describe('Level styling', () => {
    it('should apply primary colors to text', () => {
      const testText = 'Test message';
      const result = LEVEL_INFO.primary(testText);
      expect(result).toContain(testText);
      expect(result).not.toBe(testText); // Should be colored
    });

    it('should apply secondary colors to text', () => {
      const testText = 'Test message';
      const result = LEVEL_INFO.secondary(testText);
      expect(result).toContain(testText);
      expect(result).not.toBe(testText); // Should be colored
    });

    it('should have styled names', () => {
      Object.values(LOGGER_LEVELS).forEach(level => {
        expect(level.styledName).toBeDefined();
        expect(typeof level.styledName).toBe('string');
      });
    });
  });

  describe('Type safety', () => {
    it('should allow valid level names', () => {
      const validLevels: LoggerLiteLevelName[] = [
        'SECURITY',
        'CRITICAL',
        'ERROR',
        'WARN',
        'SUCCESS',
        'INFO',
        'DEBUG',
        'TRACE',
        'RAINBOW',
        'ANY',
      ];

      validLevels.forEach(levelName => {
        expect(LOGGER_LEVELS[levelName]).toBeDefined();
      });
    });
  });
});
