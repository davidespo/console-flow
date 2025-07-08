import {
  GcpSeverity,
  GcpResource,
  GcpLogEntry,
  LEVEL_TO_GCP_SEVERITY,
  GcpLoggerOptionsSchema,
  GCP_RESOURCE_TYPES,
  GcpResourceType,
} from '../../src/types/gcp';

describe('GCP Types', () => {
  describe('GcpSeverity', () => {
    it('should contain all expected severity levels', () => {
      expect(GcpSeverity.DEFAULT).toBe('DEFAULT');
      expect(GcpSeverity.DEBUG).toBe('DEBUG');
      expect(GcpSeverity.INFO).toBe('INFO');
      expect(GcpSeverity.NOTICE).toBe('NOTICE');
      expect(GcpSeverity.WARNING).toBe('WARNING');
      expect(GcpSeverity.ERROR).toBe('ERROR');
      expect(GcpSeverity.CRITICAL).toBe('CRITICAL');
      expect(GcpSeverity.ALERT).toBe('ALERT');
      expect(GcpSeverity.EMERGENCY).toBe('EMERGENCY');
    });

    it('should have correct severity ordering', () => {
      const severities = Object.values(GcpSeverity);
      expect(severities).toContain('DEFAULT');
      expect(severities).toContain('DEBUG');
      expect(severities).toContain('INFO');
      expect(severities).toContain('WARNING');
      expect(severities).toContain('ERROR');
      expect(severities).toContain('CRITICAL');
      expect(severities).toContain('ALERT');
      expect(severities).toContain('EMERGENCY');
    });
  });

  describe('GcpResource', () => {
    it('should have correct structure', () => {
      const resource: GcpResource = {
        type: 'gce_instance',
        labels: {
          instance_id: 'test-instance',
          zone: 'us-central1-a',
        },
      };

      expect(resource.type).toBe('gce_instance');
      expect(resource.labels).toEqual({
        instance_id: 'test-instance',
        zone: 'us-central1-a',
      });
    });

    it('should allow different resource types', () => {
      const gceResource: GcpResource = {
        type: 'gce_instance',
        labels: {},
      };

      const gkeResource: GcpResource = {
        type: 'k8s_container',
        labels: {},
      };

      expect(gceResource.type).toBe('gce_instance');
      expect(gkeResource.type).toBe('k8s_container');
    });
  });

  describe('GcpLogEntry', () => {
    it('should have correct structure with textPayload', () => {
      const logEntry: GcpLogEntry = {
        severity: GcpSeverity.INFO,
        timestamp: '2025-07-08T15:52:08.172Z',
        textPayload: 'Test log message',
      };

      expect(logEntry.severity).toBe(GcpSeverity.INFO);
      expect(logEntry.timestamp).toBe('2025-07-08T15:52:08.172Z');
      expect(logEntry.textPayload).toBe('Test log message');
      expect(logEntry.jsonPayload).toBeUndefined();
    });

    it('should have correct structure with jsonPayload', () => {
      const logEntry: GcpLogEntry = {
        severity: GcpSeverity.ERROR,
        timestamp: '2025-07-08T15:52:08.172Z',
        jsonPayload: {
          message: 'Error occurred',
          error: {
            name: 'TestError',
            stack: 'Error stack trace',
          },
        },
      };

      expect(logEntry.severity).toBe(GcpSeverity.ERROR);
      expect(logEntry.jsonPayload).toBeDefined();
      expect(logEntry.jsonPayload?.message).toBe('Error occurred');
      expect(logEntry.textPayload).toBeUndefined();
    });

    it('should support optional fields', () => {
      const logEntry: GcpLogEntry = {
        severity: GcpSeverity.WARNING,
        timestamp: '2025-07-08T15:52:08.172Z',
        resource: {
          type: 'gce_instance',
          labels: {instance_id: 'test'},
        },
        labels: {environment: 'production'},
        trace: 'projects/test/traces/abc123',
        spanId: 'def456',
        traceSampled: true,
        sourceLocation: {
          file: 'test.ts',
          line: '10',
          function: 'testFunction',
        },
      };

      expect(logEntry.resource).toBeDefined();
      expect(logEntry.labels).toBeDefined();
      expect(logEntry.trace).toBe('projects/test/traces/abc123');
      expect(logEntry.spanId).toBe('def456');
      expect(logEntry.traceSampled).toBe(true);
      expect(logEntry.sourceLocation?.file).toBe('test.ts');
    });
  });

  describe('LEVEL_TO_GCP_SEVERITY', () => {
    it('should map all console-flow levels to GCP severities', () => {
      expect(LEVEL_TO_GCP_SEVERITY.SECURITY).toBe(GcpSeverity.ALERT);
      expect(LEVEL_TO_GCP_SEVERITY.CRITICAL).toBe(GcpSeverity.CRITICAL);
      expect(LEVEL_TO_GCP_SEVERITY.ERROR).toBe(GcpSeverity.ERROR);
      expect(LEVEL_TO_GCP_SEVERITY.WARN).toBe(GcpSeverity.WARNING);
      expect(LEVEL_TO_GCP_SEVERITY.SUCCESS).toBe(GcpSeverity.INFO);
      expect(LEVEL_TO_GCP_SEVERITY.INFO).toBe(GcpSeverity.INFO);
      expect(LEVEL_TO_GCP_SEVERITY.DEBUG).toBe(GcpSeverity.DEBUG);
      expect(LEVEL_TO_GCP_SEVERITY.TRACE).toBe(GcpSeverity.DEBUG);
      expect(LEVEL_TO_GCP_SEVERITY.RAINBOW).toBe(GcpSeverity.INFO);
    });

    it('should have appropriate severity mappings', () => {
      // Security alerts should map to ALERT
      expect(LEVEL_TO_GCP_SEVERITY.SECURITY).toBe(GcpSeverity.ALERT);

      // Critical errors should map to CRITICAL
      expect(LEVEL_TO_GCP_SEVERITY.CRITICAL).toBe(GcpSeverity.CRITICAL);

      // Regular errors should map to ERROR
      expect(LEVEL_TO_GCP_SEVERITY.ERROR).toBe(GcpSeverity.ERROR);

      // Warnings should map to WARNING
      expect(LEVEL_TO_GCP_SEVERITY.WARN).toBe(GcpSeverity.WARNING);

      // Info and success should map to INFO
      expect(LEVEL_TO_GCP_SEVERITY.INFO).toBe(GcpSeverity.INFO);
      expect(LEVEL_TO_GCP_SEVERITY.SUCCESS).toBe(GcpSeverity.INFO);
      expect(LEVEL_TO_GCP_SEVERITY.RAINBOW).toBe(GcpSeverity.INFO);

      // Debug and trace should map to DEBUG
      expect(LEVEL_TO_GCP_SEVERITY.DEBUG).toBe(GcpSeverity.DEBUG);
      expect(LEVEL_TO_GCP_SEVERITY.TRACE).toBe(GcpSeverity.DEBUG);
    });
  });

  describe('GcpLoggerOptionsSchema', () => {
    it('should validate valid options', () => {
      const validOptions = {
        projectId: 'test-project',
        resource: {
          type: 'gce_instance',
          labels: {instance_id: 'test'},
        },
        labels: {environment: 'production'},
        enableTracing: true,
        enableSourceLocation: false,
      };

      const result = GcpLoggerOptionsSchema.safeParse(validOptions);
      expect(result.success).toBe(true);
    });

    it('should validate minimal options', () => {
      const minimalOptions = {};

      const result = GcpLoggerOptionsSchema.safeParse(minimalOptions);
      expect(result.success).toBe(true);
    });

    it('should provide default values', () => {
      const options = {};

      const result = GcpLoggerOptionsSchema.parse(options);
      expect(result.enableTracing).toBe(false);
      expect(result.enableSourceLocation).toBe(true);
    });

    it('should reject invalid resource structure', () => {
      const invalidOptions = {
        resource: {
          type: 'gce_instance',
          // Missing labels
        },
      };

      const result = GcpLoggerOptionsSchema.safeParse(invalidOptions);
      expect(result.success).toBe(false);
    });

    it('should reject invalid labels structure', () => {
      const invalidOptions = {
        labels: {
          environment: 123, // Should be string
        },
      };

      const result = GcpLoggerOptionsSchema.safeParse(invalidOptions);
      expect(result.success).toBe(false);
    });
  });

  describe('GCP_RESOURCE_TYPES', () => {
    it('should contain all expected resource types', () => {
      expect(GCP_RESOURCE_TYPES.GCE_INSTANCE).toBe('gce_instance');
      expect(GCP_RESOURCE_TYPES.GKE_CONTAINER).toBe('k8s_container');
      expect(GCP_RESOURCE_TYPES.CLOUD_RUN_REVISION).toBe('cloud_run_revision');
      expect(GCP_RESOURCE_TYPES.CLOUD_FUNCTION).toBe('cloud_function');
      expect(GCP_RESOURCE_TYPES.APP_ENGINE_VERSION).toBe('gae_app');
      expect(GCP_RESOURCE_TYPES.CLOUD_SQL_INSTANCE).toBe('cloudsql_database');
      expect(GCP_RESOURCE_TYPES.DATAFLOW_JOB).toBe('dataflow_job');
      expect(GCP_RESOURCE_TYPES.CLOUD_BUILD_BUILD).toBe('cloud_build');
      expect(GCP_RESOURCE_TYPES.CLOUD_TASK_QUEUE).toBe('cloud_task_queue');
      expect(GCP_RESOURCE_TYPES.CLOUD_SCHEDULER_JOB).toBe(
        'cloud_scheduler_job',
      );
    });

    it('should have correct resource type values', () => {
      const resourceTypes = Object.values(GCP_RESOURCE_TYPES);
      expect(resourceTypes).toContain('gce_instance');
      expect(resourceTypes).toContain('k8s_container');
      expect(resourceTypes).toContain('cloud_run_revision');
      expect(resourceTypes).toContain('cloud_function');
      expect(resourceTypes).toContain('gae_app');
    });
  });

  describe('Type safety', () => {
    it('should allow valid GcpResourceType values', () => {
      const validTypes: GcpResourceType[] = [
        'gce_instance',
        'k8s_container',
        'cloud_run_revision',
        'cloud_function',
        'gae_app',
        'cloudsql_database',
        'dataflow_job',
        'cloud_build',
        'cloud_task_queue',
        'cloud_scheduler_job',
      ];

      validTypes.forEach(type => {
        expect(Object.values(GCP_RESOURCE_TYPES)).toContain(type);
      });
    });

    it('should create valid GcpResource with GcpResourceType', () => {
      const resource: GcpResource = {
        type: GCP_RESOURCE_TYPES.GCE_INSTANCE,
        labels: {
          instance_id: 'test-instance',
          zone: 'us-central1-a',
        },
      };

      expect(resource.type).toBe('gce_instance');
    });
  });
});
