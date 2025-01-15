import {Logger} from '../../src/logger/Logger.js';
import {testLevels} from '../utils';

const logger = new Logger({
  prefix: {value: 'test-levels', color: 'blue_800'},
});

testLevels(logger, 'Hello, World!', {arr: [true, 123, 'abc']});
