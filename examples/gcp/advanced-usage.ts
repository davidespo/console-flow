import {FlowLogger} from '../../src/index';
import {GcpResourceDetector} from '../../src/logger/GcpResourceDetector';
import {GcpTracingSupport} from '../../src/logger/GcpTracingSupport';

console.log('=== GCP Logging Advanced Usage Example ===\n');

// Example 1: Auto-detection of GCP environment
console.log('1. Auto-detection of GCP Environment:');
const isGcpEnv = GcpResourceDetector.isGcpEnvironment();
console.log('Is GCP Environment:', isGcpEnv);

const detectedResource = GcpResourceDetector.detectResource();
console.log('Detected Resource:', detectedResource);

const defaultLabels = GcpResourceDetector.getDefaultLabels();
console.log('Default Labels:', defaultLabels);

console.log('');

// Example 2: GCP logger with auto-detected resource
console.log('2. GCP Logger with Auto-detected Resource:');
const autoLogger = new FlowLogger({
  format: 'gcp',
  prefix: {value: 'auto-detection'},
  gcp: {
    enableTracing: false,
    enableSourceLocation: true,
    resource: detectedResource || undefined,
    labels: {
      ...defaultLabels,
      component: 'auto-detection-service',
    },
  },
});

autoLogger.info('Auto-detection logger initialized', {
  detectedResource: !!detectedResource,
  isGcpEnvironment: isGcpEnv,
});

console.log('');

// Example 3: Tracing support
console.log('3. Tracing Support:');
const isTracingAvailable = GcpTracingSupport.isTracingAvailable();
console.log('Is Tracing Available:', isTracingAvailable);

const traceContext = GcpTracingSupport.extractTraceContext();
console.log('Trace Context:', traceContext);

const gcpTraceContext = GcpTracingSupport.getGcpTraceContext();
console.log('GCP Trace Context:', gcpTraceContext);

// Simulate tracing environment
const originalEnv = process.env;
process.env.GOOGLE_CLOUD_PROJECT = 'test-project-123';
process.env.TRACE_ID = '1234567890abcdef1234567890abcdef';
process.env.SPAN_ID = 'abcdef1234567890';
process.env.TRACE_SAMPLED = 'true';

const tracingLogger = new FlowLogger({
  format: 'gcp',
  gcp: {
    enableTracing: true,
    enableSourceLocation: true,
    labels: {
      component: 'tracing-service',
    },
  },
});

tracingLogger.info('Tracing enabled log message', {
  traceId: process.env.TRACE_ID,
  spanId: process.env.SPAN_ID,
});

// Restore environment
process.env = originalEnv;

console.log('');

// Example 4: Simulated Cloud Run environment
console.log('4. Simulated Cloud Run Environment:');
process.env.GOOGLE_CLOUD_PROJECT = 'my-project-123';
process.env.K_REVISION = 'my-service-00001-abc';
process.env.K_SERVICE = 'my-service';
process.env.K_REGION = 'us-central1';

const cloudRunResource = GcpResourceDetector.detectResource();
console.log('Cloud Run Resource:', cloudRunResource);

const cloudRunLogger = new FlowLogger({
  format: 'gcp',
  gcp: {
    enableTracing: false,
    enableSourceLocation: true,
    resource: cloudRunResource || undefined,
    labels: {
      environment: 'production',
      service: 'cloud-run-service',
    },
  },
});

cloudRunLogger.info('Cloud Run service started', {
  revision: process.env.K_REVISION,
  service: process.env.K_SERVICE,
  region: process.env.K_REGION,
});

// Restore environment
process.env = originalEnv;

console.log('');

// Example 5: Simulated GKE environment
console.log('5. Simulated GKE Environment:');
process.env.GOOGLE_CLOUD_PROJECT = 'my-project-123';
process.env.KUBERNETES_SERVICE_HOST = '10.0.0.1';
process.env.GKE_CLUSTER_NAME = 'my-cluster';
process.env.KUBERNETES_NAMESPACE = 'production';
process.env.HOSTNAME = 'my-pod-abc123';
process.env.KUBERNETES_CONTAINER_NAME = 'app';

const gkeResource = GcpResourceDetector.detectResource();
console.log('GKE Resource:', gkeResource);

const gkeLogger = new FlowLogger({
  format: 'gcp',
  gcp: {
    enableTracing: false,
    enableSourceLocation: true,
    resource: gkeResource || undefined,
    labels: {
      environment: 'production',
      service: 'gke-service',
    },
  },
});

gkeLogger.info('GKE pod started', {
  cluster: process.env.GKE_CLUSTER_NAME,
  namespace: process.env.KUBERNETES_NAMESPACE,
  pod: process.env.HOSTNAME,
  container: process.env.KUBERNETES_CONTAINER_NAME,
});

// Restore environment
process.env = originalEnv;

console.log('');

// Example 6: Performance monitoring
console.log('6. Performance Monitoring:');
const perfLogger = new FlowLogger({
  format: 'gcp',
  gcp: {
    enableTracing: false,
    enableSourceLocation: true,
    labels: {
      component: 'performance-monitor',
    },
  },
});

// Simulate performance monitoring
const startTime = Date.now();
setTimeout(() => {
  const endTime = Date.now();
  const duration = endTime - startTime;

  perfLogger.info('Operation completed', {
    operation: 'database-query',
    duration: duration,
    startTime: new Date(startTime).toISOString(),
    endTime: new Date(endTime).toISOString(),
    success: true,
  });
}, 100);

console.log('');

console.log('=== GCP Logging Advanced Usage Example Complete ===');
