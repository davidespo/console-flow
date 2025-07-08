import {GcpTracingSupport} from '../../src/logger/GcpTracingSupport';

console.log('=== Testing GCP Tracing Support ===\n');

// Test 1: No tracing context (local environment)
console.log('1. No tracing context:');
const noContext = GcpTracingSupport.extractTraceContext();
console.log('Extracted context:', noContext);
console.log('Is tracing available:', GcpTracingSupport.isTracingAvailable());
console.log('');

// Test 2: Cloud Trace environment variables
console.log('2. Cloud Trace environment variables:');
const originalEnv = process.env;
process.env.TRACE_ID = '1234567890abcdef1234567890abcdef';
process.env.SPAN_ID = 'abcdef1234567890';
process.env.TRACE_SAMPLED = 'true';

const cloudTraceContext = GcpTracingSupport.extractTraceContext();
console.log('Cloud Trace context:', cloudTraceContext);
console.log('Is tracing available:', GcpTracingSupport.isTracingAvailable());

// Restore environment
process.env = originalEnv;
console.log('');

// Test 3: OpenTelemetry environment variables
console.log('3. OpenTelemetry environment variables:');
process.env.OTEL_TRACE_ID = 'abcdef1234567890abcdef1234567890';
process.env.OTEL_SPAN_ID = '1234567890abcdef';

const otelContext = GcpTracingSupport.extractTraceContext();
console.log('OpenTelemetry context:', otelContext);

// Restore environment
process.env = originalEnv;
console.log('');

// Test 4: W3C traceparent header
console.log('4. W3C traceparent header:');
process.env.TRACEPARENT =
  '00-1234567890abcdef1234567890abcdef-abcdef1234567890-01';

const w3cContext = GcpTracingSupport.extractTraceContext();
console.log('W3C context:', w3cContext);

// Restore environment
process.env = originalEnv;
console.log('');

// Test 5: Invalid W3C traceparent
console.log('5. Invalid W3C traceparent:');
process.env.TRACEPARENT = 'invalid-format';

const invalidContext = GcpTracingSupport.extractTraceContext();
console.log('Invalid context:', invalidContext);

// Restore environment
process.env = originalEnv;
console.log('');

// Test 6: Generate test trace context
console.log('6. Generate test trace context:');
const testContext = GcpTracingSupport.generateTestTraceContext();
console.log('Generated context:', testContext);
console.log('Trace ID length:', testContext.traceId?.length);
console.log('Span ID length:', testContext.spanId?.length);
console.log('');

// Test 7: GCP trace context format
console.log('7. GCP trace context format:');
process.env.GOOGLE_CLOUD_PROJECT = 'test-project-123';
process.env.TRACE_ID = '1234567890abcdef1234567890abcdef';
process.env.SPAN_ID = 'abcdef1234567890';
process.env.TRACE_SAMPLED = 'true';

const gcpTraceContext = GcpTracingSupport.getGcpTraceContext();
console.log('GCP trace context:', gcpTraceContext);

// Restore environment
process.env = originalEnv;
console.log('');

console.log('=== GCP Tracing Support Test Complete ===');
