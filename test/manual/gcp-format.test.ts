import {FlowLogger} from '../../src/index';
import {GCP_RESOURCE_TYPES} from '../../src/types/gcp';

console.log('=== Testing GCP Format Integration ===\n');

// Test 1: Basic GCP format
console.log('1. Basic GCP format:');
const basicGcpLogger = new FlowLogger({
  format: 'gcp',
  prefix: {value: 'test-app'},
});

basicGcpLogger.info('User logged in successfully', {
  userId: 12345,
  sessionId: 'abc123',
});
basicGcpLogger.error(
  'Database connection failed',
  new Error('Connection timeout'),
  {retryCount: 3},
);
console.log('');

// Test 2: GCP format with resource configuration
console.log('2. GCP format with resource configuration:');
const resourceGcpLogger = new FlowLogger({
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

resourceGcpLogger.warn('High memory usage detected', {
  memoryUsage: '85%',
  threshold: '80%',
});
resourceGcpLogger.critical('System failure', new Error('Out of memory'), {
  component: 'database',
});
console.log('');

// Test 3: GCP format with source location
console.log('3. GCP format with source location:');
const sourceGcpLogger = new FlowLogger({
  format: 'gcp',
  filename: 'user-service.ts',
  gcp: {
    enableTracing: false,
    enableSourceLocation: true,
  },
});

sourceGcpLogger.debug('Processing user request', {
  requestId: 'req-123',
  method: 'POST',
});
console.log('');

// Test 4: Compare different formats
console.log('4. Compare GCP vs JSON formats:');
const testData = {
  userId: 12345,
  operation: 'user_login',
  timestamp: Date.now(),
};

const jsonLogger = new FlowLogger({format: 'json'});
const gcpLogger = new FlowLogger({format: 'gcp'});

console.log('JSON format:');
jsonLogger.info('Test message', testData);

console.log('\nGCP format:');
gcpLogger.info('Test message', testData);
console.log('');

// Test 5: Error handling in GCP format
console.log('5. Error handling in GCP format:');
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
  throw new Error('Payment processing failed');
} catch (error) {
  errorLogger.error('Payment error occurred', error, {
    orderId: 'order-123',
    amount: 99.99,
  });
}

console.log('\n=== GCP Format Integration Test Complete ===');
