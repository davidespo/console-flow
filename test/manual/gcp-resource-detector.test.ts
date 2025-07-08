import {GcpResourceDetector} from '../../src/logger/GcpResourceDetector';

console.log('=== Testing GCP Resource Detector ===\n');

// Test 1: Check if running in GCP environment
console.log('1. GCP Environment Detection:');
console.log('Is GCP Environment:', GcpResourceDetector.isGcpEnvironment());
console.log('');

// Test 2: Default labels
console.log('2. Default Labels:');
const defaultLabels = GcpResourceDetector.getDefaultLabels();
console.log('Default labels:', defaultLabels);
console.log('');

// Test 3: Resource detection (should be null in local environment)
console.log('3. Resource Detection:');
const detectedResource = GcpResourceDetector.detectResource();
console.log('Detected resource:', detectedResource);
console.log('');

// Test 4: Simulate GCE environment
console.log('4. Simulated GCE Environment:');
const originalEnv = process.env;
process.env.GOOGLE_CLOUD_PROJECT = 'test-project-123';
process.env.GCE_INSTANCE_ID = '123456789';
process.env.GCE_INSTANCE_ZONE = 'projects/test-project-123/zones/us-central1-a';

const gceResource = GcpResourceDetector.detectResource();
console.log('GCE Resource:', gceResource);
console.log('Is GCP Environment:', GcpResourceDetector.isGcpEnvironment());

// Restore environment
process.env = originalEnv;
console.log('');

// Test 5: Simulate Cloud Run environment
console.log('5. Simulated Cloud Run Environment:');
// Clear previous environment variables
delete process.env.GCE_INSTANCE_ID;
delete process.env.GCE_INSTANCE_ZONE;
process.env.GOOGLE_CLOUD_PROJECT = 'test-project-123';
process.env.K_REVISION = 'my-service-00001-abc';
process.env.K_SERVICE = 'my-service';
process.env.K_REGION = 'us-central1';

const cloudRunResource = GcpResourceDetector.detectResource();
console.log('Cloud Run Resource:', cloudRunResource);

// Restore environment
process.env = originalEnv;
console.log('');

// Test 6: Simulate GKE environment
console.log('6. Simulated GKE Environment:');
// Clear previous environment variables
delete process.env.GCE_INSTANCE_ID;
delete process.env.GCE_INSTANCE_ZONE;
delete process.env.K_REVISION;
delete process.env.K_SERVICE;
delete process.env.K_REGION;
process.env.GOOGLE_CLOUD_PROJECT = 'test-project-123';
process.env.KUBERNETES_SERVICE_HOST = '10.0.0.1';
process.env.GKE_CLUSTER_NAME = 'my-cluster';
process.env.KUBERNETES_NAMESPACE = 'production';
process.env.HOSTNAME = 'my-pod-abc123';
process.env.KUBERNETES_CONTAINER_NAME = 'app';

const gkeResource = GcpResourceDetector.detectResource();
console.log('GKE Resource:', gkeResource);

// Restore environment
process.env = originalEnv;
console.log('');

console.log('=== GCP Resource Detector Test Complete ===');
