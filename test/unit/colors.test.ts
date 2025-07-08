import {
  NAMED_COLORS,
  addColor,
  stripAnsiColors,
  hasAnsiColors,
  unescapeAnsiCodes,
  escapeAnsiCodes,
  applyLevelColors,
  ColorStrategy,
  HexColorSchema,
} from '../../src/colors';

describe('Colors', () => {
  describe('NAMED_COLORS', () => {
    it('should contain all expected color definitions', () => {
      expect(NAMED_COLORS).toHaveProperty('red_200');
      expect(NAMED_COLORS).toHaveProperty('blue_800');
      expect(NAMED_COLORS).toHaveProperty('green_600');
      expect(NAMED_COLORS).toHaveProperty('yellow_400');
      expect(NAMED_COLORS).toHaveProperty('purple_800');
      expect(NAMED_COLORS).toHaveProperty('gray_600');
    });

    it('should have valid hex color values', () => {
      Object.values(NAMED_COLORS).forEach(color => {
        expect(color).toMatch(/^#[A-Fa-f0-9]{6}$/);
      });
    });
  });

  describe('addColor', () => {
    it('should apply named colors correctly', () => {
      const result = addColor('test message', 'red_800');
      expect(result).toContain('test message');
      expect(hasAnsiColors(result)).toBe(true);
    });

    it('should apply hex colors correctly', () => {
      const result = addColor('test message', '#ff0000');
      expect(result).toContain('test message');
      expect(hasAnsiColors(result)).toBe(true);
    });

    it('should handle invalid color names gracefully', () => {
      const result = addColor('test message', 'invalid_color' as any);
      expect(result).toContain('test message');
      // The function might still apply some color or return the original text
      expect(typeof result).toBe('string');
    });
  });

  describe('stripAnsiColors', () => {
    it('should remove ANSI color codes from text', () => {
      const coloredText = '\u001b[32mHello\u001b[0m World';
      const result = stripAnsiColors(coloredText);
      expect(result).toBe('Hello World');
    });

    it('should remove escaped ANSI codes', () => {
      const escapedText = '\\u001b[32mHello\\u001b[0m World';
      const result = stripAnsiColors(escapedText);
      expect(result).toBe('Hello World');
    });

    it('should handle text without colors', () => {
      const plainText = 'Hello World';
      const result = stripAnsiColors(plainText);
      expect(result).toBe(plainText);
    });

    it('should handle complex ANSI sequences', () => {
      const complexText = '\u001b[1;32;40mBold Green on Black\u001b[0m';
      const result = stripAnsiColors(complexText);
      expect(result).toBe('Bold Green on Black');
    });
  });

  describe('hasAnsiColors', () => {
    it('should detect ANSI color codes', () => {
      const coloredText = '\u001b[32mHello\u001b[0m';
      expect(hasAnsiColors(coloredText)).toBe(true);
    });

    it('should detect escaped ANSI codes', () => {
      const escapedText = '\\u001b[32mHello\\u001b[0m';
      expect(hasAnsiColors(escapedText)).toBe(true);
    });

    it('should return false for plain text', () => {
      const plainText = 'Hello World';
      expect(hasAnsiColors(plainText)).toBe(false);
    });
  });

  describe('unescapeAnsiCodes', () => {
    it('should convert escaped ANSI codes to raw codes', () => {
      const escapedText = '\\u001b[32mHello\\u001b[0m';
      const result = unescapeAnsiCodes(escapedText);
      expect(result).toBe('\u001b[32mHello\u001b[0m');
    });

    it('should handle text without escaped codes', () => {
      const plainText = 'Hello World';
      const result = unescapeAnsiCodes(plainText);
      expect(result).toBe(plainText);
    });
  });

  describe('escapeAnsiCodes', () => {
    it('should convert raw ANSI codes to escaped codes', () => {
      const rawText = '\u001b[32mHello\u001b[0m';
      const result = escapeAnsiCodes(rawText);
      expect(result).toBe('\\u001b[32mHello\\u001b[0m');
    });

    it('should handle text without ANSI codes', () => {
      const plainText = 'Hello World';
      const result = escapeAnsiCodes(plainText);
      expect(result).toBe(plainText);
    });
  });

  describe('applyLevelColors', () => {
    it('should strip existing colors and apply new ones', () => {
      const coloredText = '\u001b[31mRed text\u001b[0m';
      const levelColor = (text: string) => `\u001b[32m${text}\u001b[0m`;
      const result = applyLevelColors(coloredText, levelColor);

      // Should not contain the original red color
      expect(result).not.toContain('\u001b[31m');
      // Should contain the new green color
      expect(result).toContain('\u001b[32m');
      expect(result).toContain('Red text');
    });
  });

  describe('ColorStrategy', () => {
    describe('json', () => {
      it('should strip all colors for JSON format', () => {
        const coloredText = '\u001b[32mHello\u001b[0m World';
        const result = ColorStrategy.json(coloredText);
        expect(result).toBe('Hello World');
      });
    });

    describe('console', () => {
      it('should preserve existing colors', () => {
        const coloredText = '\u001b[32mHello\u001b[0m World';
        const levelColor = (text: string) => `\u001b[31m${text}\u001b[0m`;
        const result = ColorStrategy.console(coloredText, levelColor);
        expect(result).toContain('\u001b[32m');
        expect(result).not.toContain('\u001b[31m');
      });

      it('should apply level colors when no colors exist', () => {
        const plainText = 'Hello World';
        const levelColor = (text: string) => `\u001b[32m${text}\u001b[0m`;
        const result = ColorStrategy.console(plainText, levelColor);
        expect(result).toContain('\u001b[32m');
      });
    });

    describe('prettyJson', () => {
      it('should strip colors for pretty JSON format', () => {
        const coloredText = '\u001b[32mHello\u001b[0m World';
        const result = ColorStrategy.prettyJson(coloredText);
        expect(result).toBe('Hello World');
      });
    });
  });

  describe('HexColorSchema', () => {
    it('should validate correct hex colors', () => {
      expect(HexColorSchema.safeParse('#ff0000').success).toBe(true);
      expect(HexColorSchema.safeParse('#00ff00').success).toBe(true);
      expect(HexColorSchema.safeParse('#0000ff').success).toBe(true);
      expect(HexColorSchema.safeParse('#ffffff').success).toBe(true);
      expect(HexColorSchema.safeParse('#000000').success).toBe(true);
    });

    it('should reject invalid hex colors', () => {
      expect(HexColorSchema.safeParse('ff0000').success).toBe(false);
      expect(HexColorSchema.safeParse('#ff00').success).toBe(false);
      expect(HexColorSchema.safeParse('#ff00000').success).toBe(false);
      expect(HexColorSchema.safeParse('red').success).toBe(false);
      expect(HexColorSchema.safeParse('').success).toBe(false);
    });
  });
});
