import {NAMED_COLORS} from '../../src/colors';
import {Logger} from '../../src/logger/Logger';

const testColor = (color: string) => {
  const logger = new Logger({
    format: 'cli',
    prefix: {value: 'color-test' + color, color},
  });
  logger.log(`Testing color: ${color}`);
};

Object.keys(NAMED_COLORS).forEach(color => {
  testColor(color);
});
