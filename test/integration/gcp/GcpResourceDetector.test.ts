import {
  GcpResourceDetector,
  GcpEnvironmentInfo,
} from '../../../src/logger/GcpResourceDetector';
import {GCP_RESOURCE_TYPES} from '../../../src/types/gcp';

describe('GcpResourceDetector', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment variables before each test
    process.env = {...originalEnv};
  });

  afterAll(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('detectResource', () => {
    it('should detect GCE Instance', () => {
      process.env.GCE_INSTANCE_ID = 'test-instance-123';
      process.env.GCE_INSTANCE_ZONE = 'projects/123456/zones/us-central1-a';
      process.env.GOOGLE_CLOUD_PROJECT = 'test-project';

      const resource = GcpResourceDetector.detectResource();

      expect(resource).toBeDefined();
      expect(resource?.type).toBe(GCP_RESOURCE_TYPES.GCE_INSTANCE);
      expect(resource?.labels).toEqual({
        instance_id: 'test-instance-123',
        zone: 'us-central1-a',
        project_id: 'test-project',
      });
    });

    it('should detect GKE Container', () => {
      process.env.KUBERNETES_SERVICE_HOST = '10.0.0.1';
      process.env.GKE_CLUSTER_NAME = 'test-cluster';
      process.env.KUBERNETES_NAMESPACE = 'test-namespace';
      process.env.HOSTNAME = 'test-pod-123';
      process.env.KUBERNETES_CONTAINER_NAME = 'test-container';
      process.env.GOOGLE_CLOUD_PROJECT = 'test-project';
      process.env.GCE_INSTANCE_ZONE = 'us-central1-a';

      const resource = GcpResourceDetector.detectResource();

      expect(resource).toBeDefined();
      expect(resource?.type).toBe(GCP_RESOURCE_TYPES.GKE_CONTAINER);
      expect(resource?.labels).toEqual({
        cluster_name: 'test-cluster',
        namespace_name: 'test-namespace',
        pod_name: 'test-pod-123',
        container_name: 'test-container',
        project_id: 'test-project',
        location: 'us-central1-a',
      });
    });

    it('should detect Cloud Run Revision', () => {
      process.env.K_REVISION = 'test-service-abc123';
      process.env.K_SERVICE = 'test-service';
      process.env.K_REGION = 'us-central1';
      process.env.GOOGLE_CLOUD_PROJECT = 'test-project';

      const resource = GcpResourceDetector.detectResource();

      expect(resource).toBeDefined();
      expect(resource?.type).toBe(GCP_RESOURCE_TYPES.CLOUD_RUN_REVISION);
      expect(resource?.labels).toEqual({
        service_name: 'test',
        revision_name: 'test-service-abc123',
        configuration_name: 'test',
        project_id: 'test-project',
        location: 'us-central1',
      });
    });

    it('should detect Cloud Function', () => {
      process.env.FUNCTION_NAME = 'test-function';
      process.env.FUNCTION_REGION = 'us-central1';
      process.env.GOOGLE_CLOUD_PROJECT = 'test-project';

      const resource = GcpResourceDetector.detectResource();

      expect(resource).toBeDefined();
      expect(resource?.type).toBe(GCP_RESOURCE_TYPES.CLOUD_FUNCTION);
      expect(resource?.labels).toEqual({
        function_name: 'test-function',
        project_id: 'test-project',
        region: 'us-central1',
      });
    });

    it('should detect App Engine', () => {
      process.env.GAE_VERSION = 'v1.0.0';
      process.env.GAE_SERVICE = 'test-service';
      process.env.GOOGLE_CLOUD_PROJECT = 'test-project';

      const resource = GcpResourceDetector.detectResource();

      expect(resource).toBeDefined();
      expect(resource?.type).toBe(GCP_RESOURCE_TYPES.CLOUD_FUNCTION);
      expect(resource?.labels).toEqual({
        function_name: 'test-service',
        project_id: 'test-project',
        region: 'unknown',
      });
    });

    it('should return null when no GCP environment is detected', () => {
      // Clear all GCP-related environment variables
      delete process.env.GCE_INSTANCE_ID;
      delete process.env.KUBERNETES_SERVICE_HOST;
      delete process.env.K_REVISION;
      delete process.env.FUNCTION_NAME;
      delete process.env.GAE_VERSION;

      const resource = GcpResourceDetector.detectResource();

      expect(resource).toBeNull();
    });

    it('should prioritize GCE over other environments', () => {
      // Set multiple environment variables
      process.env.GCE_INSTANCE_ID = 'test-instance-123';
      process.env.KUBERNETES_SERVICE_HOST = '10.0.0.1';
      process.env.K_REVISION = 'test-service-abc123';
      process.env.GOOGLE_CLOUD_PROJECT = 'test-project';

      const resource = GcpResourceDetector.detectResource();

      expect(resource?.type).toBe(GCP_RESOURCE_TYPES.GCE_INSTANCE);
    });
  });

  describe('getDefaultLabels', () => {
    it('should return default labels with project and region', () => {
      process.env.GOOGLE_CLOUD_PROJECT = 'test-project';
      process.env.GCE_INSTANCE_ZONE = 'us-central1-a';
      process.env.NODE_ENV = 'production';
      process.env.npm_package_name = 'test-package';

      const labels = GcpResourceDetector.getDefaultLabels();

      expect(labels).toEqual({
        project_id: 'test-project',
        zone: 'us-central1-a',
        environment: 'production',
        service: 'test-package',
      });
    });

    it('should handle missing environment variables', () => {
      const labels = GcpResourceDetector.getDefaultLabels();

      // The test environment has NODE_ENV and npm_package_name set
      expect(labels).toHaveProperty('environment');
      expect(labels).toHaveProperty('service');
    });

    it('should include only available environment variables', () => {
      process.env.GOOGLE_CLOUD_PROJECT = 'test-project';
      process.env.NODE_ENV = 'development';

      const labels = GcpResourceDetector.getDefaultLabels();

      expect(labels).toEqual({
        project_id: 'test-project',
        environment: 'development',
        service: '@de44/console-flow',
      });
    });
  });

  describe('isGcpEnvironment', () => {
    it('should return true when GCE environment is detected', () => {
      process.env.GCE_INSTANCE_ID = 'test-instance-123';

      const isGcp = GcpResourceDetector.isGcpEnvironment();

      expect(isGcp).toBe(true);
    });

    it('should return true when GKE environment is detected', () => {
      process.env.KUBERNETES_SERVICE_HOST = '10.0.0.1';
      process.env.GOOGLE_CLOUD_PROJECT = 'test-project';

      const isGcp = GcpResourceDetector.isGcpEnvironment();

      expect(isGcp).toBe(true);
    });

    it('should return true when Cloud Run environment is detected', () => {
      process.env.K_REVISION = 'test-service-abc123';

      const isGcp = GcpResourceDetector.isGcpEnvironment();

      expect(isGcp).toBe(true);
    });

    it('should return true when Cloud Function environment is detected', () => {
      process.env.FUNCTION_NAME = 'test-function';

      const isGcp = GcpResourceDetector.isGcpEnvironment();

      expect(isGcp).toBe(true);
    });

    it('should return true when App Engine environment is detected', () => {
      process.env.GAE_VERSION = 'v1.0.0';

      const isGcp = GcpResourceDetector.isGcpEnvironment();

      expect(isGcp).toBe(true);
    });

    it('should return false when no GCP environment is detected', () => {
      const isGcp = GcpResourceDetector.isGcpEnvironment();

      expect(isGcp).toBe(false);
    });
  });

  describe('environment variable parsing', () => {
    it('should handle zone parsing from full path', () => {
      process.env.GCE_INSTANCE_ZONE = 'projects/123456/zones/us-central1-a';
      process.env.GCE_INSTANCE_ID = 'test-instance-123';

      const resource = GcpResourceDetector.detectResource();

      expect(resource?.labels?.zone).toBe('us-central1-a');
    });

    it('should use region when zone is not available', () => {
      process.env.K_REVISION = 'test-service-abc123';
      process.env.K_REGION = 'us-central1';

      const resource = GcpResourceDetector.detectResource();

      expect(resource?.labels?.location).toBe('us-central1');
    });

    it('should use default values for missing labels', () => {
      process.env.KUBERNETES_SERVICE_HOST = '10.0.0.1';
      process.env.HOSTNAME = 'test-pod-123';

      const resource = GcpResourceDetector.detectResource();

      expect(resource?.labels?.namespace_name).toBe('default');
      expect(resource?.labels?.container_name).toBe('main');
      expect(resource?.labels?.project_id).toBe('unknown');
      expect(resource?.labels?.location).toBe('unknown');
    });
  });
});
