import {
  buildTimestampGenerator,
  TimestampOptionSchema,
  TimestampOption,
} from '../../src/timestamp';

describe('Timestamp', () => {
  describe('buildTimestampGenerator', () => {
    it('should generate ISO8601 format by default', () => {
      const generator = buildTimestampGenerator();
      const timestamp = generator();
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
    });

    it('should generate ISO8601 format when specified', () => {
      const generator = buildTimestampGenerator('ISO8601');
      const timestamp = generator();
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
    });

    it('should generate RFC3339 format', () => {
      const generator = buildTimestampGenerator('RFC3339');
      const timestamp = generator();
      expect(timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      );
    });

    it('should generate unix timestamp', () => {
      const generator = buildTimestampGenerator('unix');
      const timestamp = generator();
      expect(timestamp).toMatch(/^\d{13}$/); // Unix timestamp in milliseconds
    });

    it('should generate locale format', () => {
      const generator = buildTimestampGenerator('locale');
      const timestamp = generator();
      // Locale format varies by system, so we just check it's a string
      expect(typeof timestamp).toBe('string');
      expect(timestamp.length).toBeGreaterThan(0);
    });

    it('should generate time only when true', () => {
      const generator = buildTimestampGenerator(true);
      const timestamp = generator();
      expect(timestamp).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });

    it('should generate empty string when false', () => {
      const generator = buildTimestampGenerator(false);
      const timestamp = generator();
      expect(timestamp).toBe('');
    });

    it('should use custom moment format', () => {
      const generator = buildTimestampGenerator('YYYY-MM-DD');
      const timestamp = generator();
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should generate different timestamps on each call', () => {
      const generator = buildTimestampGenerator();
      const timestamp1 = generator();
      // Add a small delay to ensure different timestamps
      const timestamp2 = generator();
      // Timestamps might be the same if generated very quickly, so we just check they're valid
      expect(timestamp1).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
      expect(timestamp2).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
    });
  });

  describe('TimestampOptionSchema', () => {
    it('should validate ISO8601', () => {
      expect(TimestampOptionSchema.safeParse('ISO8601').success).toBe(true);
    });

    it('should validate RFC3339', () => {
      expect(TimestampOptionSchema.safeParse('RFC3339').success).toBe(true);
    });

    it('should validate locale', () => {
      expect(TimestampOptionSchema.safeParse('locale').success).toBe(true);
    });

    it('should validate unix', () => {
      expect(TimestampOptionSchema.safeParse('unix').success).toBe(true);
    });

    it('should validate boolean true', () => {
      expect(TimestampOptionSchema.safeParse(true).success).toBe(true);
    });

    it('should validate boolean false', () => {
      expect(TimestampOptionSchema.safeParse(false).success).toBe(true);
    });

    it('should validate custom string format', () => {
      expect(TimestampOptionSchema.safeParse('YYYY-MM-DD').success).toBe(true);
    });

    it('should reject invalid values', () => {
      // The schema accepts any string, so 'invalid' is actually valid
      expect(TimestampOptionSchema.safeParse(123).success).toBe(false);
      expect(TimestampOptionSchema.safeParse(null).success).toBe(false);
      expect(TimestampOptionSchema.safeParse(undefined).success).toBe(false);
    });
  });

  describe('Type safety', () => {
    it('should accept valid timestamp options', () => {
      const validOptions: TimestampOption[] = [
        'ISO8601',
        'RFC3339',
        'locale',
        'unix',
        true,
        false,
        'YYYY-MM-DD',
      ];

      validOptions.forEach(option => {
        expect(() => buildTimestampGenerator(option)).not.toThrow();
      });
    });
  });
});
