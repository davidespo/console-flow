import {FlowLogger} from '@src/index';

const logger = new FlowLogger({
  format: 'json',
  prefix: {
    value: 'test-logger',
    color: 'blue_800',
  },
});

logger.log('Hello, world!', {foo: 'bar', baz: 3.1415, qux: true});
logger.info('Hello, world!', {foo: 'bar', baz: 3.1415, qux: true});
logger.success('Hello, world!', {foo: 'bar', baz: 3.1415, qux: true});
logger.debug('Hello, world!', {foo: 'bar', baz: 3.1415, qux: true});
logger.trace('Hello, world!', {foo: 'bar', baz: 3.1415, qux: true});
logger.warn('Hello, world!', {foo: 'bar', baz: 3.1415, qux: true});
logger.error('Hello, world!', {foo: 'bar', baz: 3.1415, qux: true});
logger.critical('Hello, world!', {foo: 'bar', baz: 3.1415, qux: true});
logger.securityAlert('Hello, world!', {foo: 'bar', baz: 3.1415, qux: true});
logger.rainbow('Hello, world!', {foo: 'bar', baz: 3.1415, qux: true});

logger.log('Hello, world!', {
  foo: 'bar',
  baz: 3.1415,
  qux: true,
  nested: {
    foo: 'bar',
    baz: 3.1415,
    qux: true,
    nested: {foo: 'bar', baz: 3.1415, qux: true},
  },
});
