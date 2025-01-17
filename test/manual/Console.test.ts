import {FlowLogger} from '../../src';

FlowLogger.configureConsole(
  new FlowLogger({
    // format: 'json',
    prefix: {
      value: 'test-logger',
      color: 'blue_800',
    },
  }),
);

console.log('Hello, world!', {foo: 'bar', baz: 3.1415, qux: true});
console.info('Hello, world!', {foo: 'bar', baz: 3.1415, qux: true});
console.success('Hello, world!', {foo: 'bar', baz: 3.1415, qux: true});
console.debug('Hello, world!', {foo: 'bar', baz: 3.1415, qux: true});
console.trace('Hello, world!', {foo: 'bar', baz: 3.1415, qux: true});
console.warn('Hello, world!', {foo: 'bar', baz: 3.1415, qux: true});
console.error('Hello, world!', {foo: 'bar', baz: 3.1415, qux: true});
console.critical('Hello, world!', {foo: 'bar', baz: 3.1415, qux: true});
console.securityAlert('Hello, world!', {foo: 'bar', baz: 3.1415, qux: true});
console.rainbow('Hello, world!', {foo: 'bar', baz: 3.1415, qux: true});

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

console.log({
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
