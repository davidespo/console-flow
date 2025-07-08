import {FlowLogger} from '../../src/index';
import {GCP_RESOURCE_TYPES} from '../../src/types/gcp';

console.log('=== GCP Logging Basic Usage Example ===\n');

// Example 1: Basic GCP format
console.log('1. Basic GCP Format:');
const basicLogger = new FlowLogger({
  format: 'gcp',
  prefix: {value: 'my-app'},
});

basicLogger.info('Application started');
basicLogger.warn('High memory usage detected', {memoryUsage: '85%'});
basicLogger.error(
  'Database connection failed',
  new Error('Connection timeout'),
  {retryCount: 3},
);

console.log('');

// Example 2: GCP format with resource configuration
console.log('2. GCP Format with Resource Configuration:');
const resourceLogger = new FlowLogger({
  format: 'gcp',
  prefix: {value: 'auth-service'},
  gcp: {
    enableTracing: false,
    enableSourceLocation: true,
    resource: {
      type: GCP_RESOURCE_TYPES.GCE_INSTANCE,
      labels: {
        instance_id: '123456789',
        zone: 'us-central1-a',
        project_id: 'my-project-123',
      },
    },
    labels: {
      environment: 'production',
      service: 'auth-api',
    },
  },
});

resourceLogger.info('User authentication successful', {
  userId: 12345,
  method: 'oauth2',
  provider: 'google',
});

console.log('');

// Example 3: Error handling with GCP format
console.log('3. Error Handling with GCP Format:');
const errorLogger = new FlowLogger({
  format: 'gcp',
  gcp: {
    enableTracing: false,
    enableSourceLocation: true,
    labels: {
      component: 'payment-service',
    },
  },
});

try {
  // Simulate an error
  throw new Error('Payment processing failed: insufficient funds');
} catch (error) {
  errorLogger.error('Payment error occurred', error, {
    orderId: 'order-123',
    amount: 99.99,
    customerId: 67890,
  });
}

console.log('');

// Example 4: Structured logging with complex context
console.log('4. Structured Logging with Complex Context:');
const structuredLogger = new FlowLogger({
  format: 'gcp',
  gcp: {
    enableTracing: false,
    enableSourceLocation: true,
  },
});

structuredLogger.info('API request processed', {
  requestId: 'req-abc123',
  method: 'POST',
  endpoint: '/api/users',
  statusCode: 201,
  responseTime: 245,
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
  ipAddress: '192.168.1.100',
  headers: {
    'content-type': 'application/json',
    authorization: 'Bearer ***',
  },
});

console.log('');

// Example 5: Different log levels
console.log('5. Different Log Levels:');
const levelLogger = new FlowLogger({
  format: 'gcp',
  prefix: {value: 'test-levels'},
});

levelLogger.trace('Trace message - detailed debugging');
levelLogger.debug('Debug message - general debugging');
levelLogger.info('Info message - general information');
levelLogger.success('Success message - operation completed');
levelLogger.warn('Warning message - potential issue');
levelLogger.error('Error message - operation failed');
levelLogger.critical('Critical message - system failure');
levelLogger.securityAlert('Security alert - suspicious activity');

console.log('\n=== GCP Logging Basic Usage Example Complete ===');
