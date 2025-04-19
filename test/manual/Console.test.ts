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
console.log(
  'Pre-colored message query: "\\u001b[94mSELECT\\u001b[0m \\u001b[37m"UserRow"\\u001b[0m\\u001b[37m.\\u001b[0m\\u001b[37m"id"\\u001b[0m \\u001b[94mAS\\u001b[0m \\u001b[37m"UserRow_id"\\u001b[0m\\u001b[37m,\\u001b[0m \\u001b[37m"UserRow"\\u001b[0m\\u001b[37m.\\u001b[0m\\u001b[37m"createdAt"\\u001b[0m \\u001b[94mAS\\u001b[0m \\u001b[37m"UserRow_createdAt"\\u001b[0m\\u001b[37m,\\u001b[0m \\u001b[37m"UserRow"\\u001b[0m\\u001b[37m.\\u001b[0m\\u001b[37m"updatedAt"\\u001b[0m \\u001b[94mAS\\u001b[0m \\u001b[37m"UserRow_updatedAt"\\u001b[0m\\u001b[37m,\\u001b[0m \\u001b[37m"UserRow"\\u001b[0m\\u001b[37m.\\u001b[0m\\u001b[37m"email"\\u001b[0m \\u001b[94mAS\\u001b[0m \\u001b[37m"UserRow_email"\\u001b[0m \\u001b[94mFROM\\u001b[0m \\u001b[37m"user_row"\\u001b[0m \\u001b[37m"UserRow"\\u001b[0m \\u001b[94mORDER BY\\u001b[0m \\u001b[37m"UserRow"\\u001b[0m\\u001b[37m.\\u001b[0m\\u001b[37m"email"\\u001b[0m \\u001b[94mASC\\u001b[0m \\u001b[94mLIMIT\\u001b[0m \\u001b[32m10\\u001b[0m"',
);

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

console.table([
  {foo: 'bar', baz: 3.1415, qux: true},
  {foo: 'bar', baz: 3.1415, qux: true},
]);
