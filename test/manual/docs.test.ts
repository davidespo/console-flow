import {FlowLogger} from '../../dist/index';

FlowLogger.configureConsole({
  format: 'cli',
  prefix: {value: 'my-app', color: 'green_800'},
});

console.info('User logged in 🔐', {userId: 123, action: 'login'});
console.success('Operation completed successfully ✅');
console.warn('High API latency detected', {
  latencyMs: 2500,
  endpoint: '/users',
});
console.debug('Cache miss for user profile', {userId: 456, source: 'redis'});
console.trace('SQL query execution details', {
  query: 'SELECT * FROM users WHERE email = ?',
  params: ['user@example.com'],
  duration: '145ms',
});
console.rainbow('🎉 1 million users milestone reached! 🎉');
console.critical('Transaction discrepency detected', {
  transactionId: 'txn_123',
  cluster: 'prod-main',
  impactedServices: ['auth', 'billing'],
});
console.securityAlert('Multiple failed login attempts detected', {
  username: 'admin',
  ipAddress: '192.168.1.100',
  attempts: 5,
});
console.error('Failed to process payment', new Error('Gateway timeout'), {
  orderId: 'ord_123',
});
