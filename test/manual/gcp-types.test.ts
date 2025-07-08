import {
  GcpSeverity,
  LEVEL_TO_GCP_SEVERITY,
  GcpLoggerOptionsSchema,
  GCP_RESOURCE_TYPES,
} from '../../src/types/gcp';

console.log('=== Testing GCP Types ===\n');

// Test 1: GCP Severity Levels
console.log('1. Testing GCP Severity Levels:');
console.log('DEFAULT:', GcpSeverity.DEFAULT);
console.log('DEBUG:', GcpSeverity.DEBUG);
console.log('INFO:', GcpSeverity.INFO);
console.log('NOTICE:', GcpSeverity.NOTICE);
console.log('WARNING:', GcpSeverity.WARNING);
console.log('ERROR:', GcpSeverity.ERROR);
console.log('CRITICAL:', GcpSeverity.CRITICAL);
console.log('ALERT:', GcpSeverity.ALERT);
console.log('EMERGENCY:', GcpSeverity.EMERGENCY);
console.log('');

// Test 2: Level Mapping
console.log('2. Testing Level to GCP Severity Mapping:');
console.log('SECURITY ->', LEVEL_TO_GCP_SEVERITY.SECURITY);
console.log('CRITICAL ->', LEVEL_TO_GCP_SEVERITY.CRITICAL);
console.log('ERROR ->', LEVEL_TO_GCP_SEVERITY.ERROR);
console.log('WARN ->', LEVEL_TO_GCP_SEVERITY.WARN);
console.log('SUCCESS ->', LEVEL_TO_GCP_SEVERITY.SUCCESS);
console.log('INFO ->', LEVEL_TO_GCP_SEVERITY.INFO);
console.log('DEBUG ->', LEVEL_TO_GCP_SEVERITY.DEBUG);
console.log('TRACE ->', LEVEL_TO_GCP_SEVERITY.TRACE);
console.log('RAINBOW ->', LEVEL_TO_GCP_SEVERITY.RAINBOW);
console.log('');

// Test 3: Schema Validation
console.log('3. Testing GCP Logger Options Schema:');
const validOptions = {
  projectId: 'my-project-123',
  resource: {
    type: 'gce_instance',
    labels: {
      instance_id: '123456789',
      zone: 'us-central1-a',
    },
  },
  labels: {
    environment: 'production',
    service: 'api',
  },
  enableTracing: true,
  enableSourceLocation: false,
};

const result = GcpLoggerOptionsSchema.safeParse(validOptions);
console.log('Valid options result:', result.success);
if (result.success) {
  console.log('Parsed options:', result.data);
}

const minimalOptions = {};
const minimalResult = GcpLoggerOptionsSchema.safeParse(minimalOptions);
console.log('Minimal options result:', minimalResult.success);
if (minimalResult.success) {
  console.log('Default values:', {
    enableTracing: minimalResult.data.enableTracing,
    enableSourceLocation: minimalResult.data.enableSourceLocation,
  });
}
console.log('');

// Test 4: GCP Resource Types
console.log('4. Testing GCP Resource Types:');
console.log('GCE_INSTANCE:', GCP_RESOURCE_TYPES.GCE_INSTANCE);
console.log('GKE_CONTAINER:', GCP_RESOURCE_TYPES.GKE_CONTAINER);
console.log('CLOUD_RUN_REVISION:', GCP_RESOURCE_TYPES.CLOUD_RUN_REVISION);
console.log('CLOUD_FUNCTION:', GCP_RESOURCE_TYPES.CLOUD_FUNCTION);
console.log('APP_ENGINE_VERSION:', GCP_RESOURCE_TYPES.APP_ENGINE_VERSION);
console.log('');

// Test 5: Verify all console-flow levels are mapped
console.log('5. Verifying all console-flow levels are mapped:');
const consoleFlowLevels = [
  'SECURITY',
  'CRITICAL',
  'ERROR',
  'WARN',
  'SUCCESS',
  'INFO',
  'DEBUG',
  'TRACE',
  'RAINBOW',
];

consoleFlowLevels.forEach(level => {
  const mapped = LEVEL_TO_GCP_SEVERITY[level];
  console.log(`${level}: ${mapped ? '✓' : '✗'} -> ${mapped || 'NOT MAPPED'}`);
});

console.log('\n=== GCP Types Test Complete ===');
