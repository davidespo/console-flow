import {FlowLogger} from '../../src';

const logger = new FlowLogger({
  format: 'json',
});

logger.log('Hello, world!', {foo: 'bar', baz: 3.1415, qux: true});

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

FlowLogger.configureConsole({
  format: 'json',
});

console.log('Hello, world!', {foo: 'bar', baz: 3.1415, qux: true});

console.log('Hello, world!', {
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

FlowLogger.configureConsole({
  format: 'prettyJson',
});

console.log('Hello, world!', {foo: 'bar', baz: 3.1415, qux: true});

console.log('Hello, world!', {
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
