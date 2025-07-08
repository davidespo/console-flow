import {GcpLogEntryBuilder} from '../../src/logger/GcpLogEntryBuilder';
import {LogEntry} from '../../src/logger/Logger';
import {GcpSeverity, GCP_RESOURCE_TYPES} from '../../src/types/gcp';

console.log('=== Testing GCP LogEntry Builder ===\n');

// Create a test LogEntry
const testLogEntry: LogEntry = {
  level: 'ERROR',
  timestamp: '2025-07-08T15:52:08.172Z',
  message: 'Database connection failed',
  metadata: {
    context: {
      userId: 12345,
      operation: 'user_login',
      retryCount: 3,
    },
    scope: {value: 'auth-service'},
    filename: 'auth.ts',
    error: {
      name: 'ConnectionError',
      stack: 'Error: Connection timeout\n    at Database.connect (db.ts:15:10)',
      code: 'ECONNREFUSED',
    },
  },
};

// Test 1: Basic GCP LogEntry transformation
console.log('1. Basic GCP LogEntry transformation:');
const basicBuilder = new GcpLogEntryBuilder();
const basicGcpEntry = basicBuilder.buildGcpLogEntry(testLogEntry);

console.log('Severity:', basicGcpEntry.severity);
console.log('Timestamp:', basicGcpEntry.timestamp);
console.log('Has jsonPayload:', !!basicGcpEntry.jsonPayload);
console.log('Has labels:', !!basicGcpEntry.labels);
console.log('Has sourceLocation:', !!basicGcpEntry.sourceLocation);

if (basicGcpEntry.jsonPayload) {
  console.log('JSON Payload keys:', Object.keys(basicGcpEntry.jsonPayload));
}

if (basicGcpEntry.labels) {
  console.log('Labels:', basicGcpEntry.labels);
}

console.log('');

// Test 2: With resource configuration
console.log('2. With resource configuration:');
const resourceBuilder = new GcpLogEntryBuilder({
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
});

const resourceGcpEntry = resourceBuilder.buildGcpLogEntry(testLogEntry);
console.log('Resource type:', resourceGcpEntry.resource?.type);
console.log('Resource labels:', resourceGcpEntry.resource?.labels);
console.log('Additional labels:', resourceGcpEntry.labels);
console.log('');

// Test 3: Text payload for simple messages
console.log('3. Text payload for simple messages:');
const simpleLogEntry: LogEntry = {
  level: 'INFO',
  timestamp: '2025-07-08T15:52:08.172Z',
  message: 'User logged in successfully',
  metadata: {
    context: 'user_id: 12345',
    scope: {value: 'auth-service'},
  },
};

const simpleGcpEntry = basicBuilder.buildGcpLogEntry(simpleLogEntry);
console.log('Has textPayload:', !!simpleGcpEntry.textPayload);
console.log('Has jsonPayload:', !!simpleGcpEntry.jsonPayload);
console.log('Text payload:', simpleGcpEntry.textPayload);
console.log('');

// Test 4: Error handling
console.log('4. Error handling:');
const errorLogEntry: LogEntry = {
  level: 'CRITICAL',
  timestamp: '2025-07-08T15:52:08.172Z',
  message: 'System failure',
  metadata: {
    context: undefined,
    scope: undefined,
    error: {
      name: 'SystemError',
      stack:
        'Error: Out of memory\n    at process.nextTick (internal/process/next_tick.js:68:7)',
    },
  },
};

const errorGcpEntry = basicBuilder.buildGcpLogEntry(errorLogEntry);
console.log('Error severity:', errorGcpEntry.severity);
console.log('Error payload:', errorGcpEntry.textPayload);
console.log('');

// Test 5: Severity mapping verification
console.log('5. Severity mapping verification:');
const severityTests = [
  {level: 'SECURITY', expected: GcpSeverity.ALERT},
  {level: 'CRITICAL', expected: GcpSeverity.CRITICAL},
  {level: 'ERROR', expected: GcpSeverity.ERROR},
  {level: 'WARN', expected: GcpSeverity.WARNING},
  {level: 'SUCCESS', expected: GcpSeverity.INFO},
  {level: 'INFO', expected: GcpSeverity.INFO},
  {level: 'DEBUG', expected: GcpSeverity.DEBUG},
  {level: 'TRACE', expected: GcpSeverity.DEBUG},
  {level: 'RAINBOW', expected: GcpSeverity.INFO},
];

severityTests.forEach(({level, expected}) => {
  const testEntry: LogEntry = {
    level,
    timestamp: '2025-07-08T15:52:08.172Z',
    message: 'Test message',
    metadata: {
      context: undefined,
      scope: undefined,
    },
  };

  const gcpEntry = basicBuilder.buildGcpLogEntry(testEntry);
  const correct = gcpEntry.severity === expected;
  console.log(`${level} -> ${gcpEntry.severity} ${correct ? '✓' : '✗'}`);
});

console.log('\n=== GCP LogEntry Builder Test Complete ===');
