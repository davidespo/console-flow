import {FlowLogger} from '@src/index';
import {recurseAndThrow} from '../utils';

const logger = new FlowLogger({
  // format: 'prettyJson',
  filename: 'stacks.log',
  prefix: {value: 'stacks', color: 'red_800'},
});

try {
  recurseAndThrow(5);
} catch (error) {
  logger.error(error);
}
try {
  recurseAndThrow(3);
} catch (error) {
  logger.error('I am passing the error as part of the context', error);
}
try {
  recurseAndThrow(3);
} catch (error) {
  logger.error('I am passing the error as part of the context', error, {
    steps: 3,
  });
}
