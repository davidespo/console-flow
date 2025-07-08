import {GcpLogEntryBuilder} from '../../../src/logger/GcpLogEntryBuilder';
import {LogEntry} from '../../../src/logger/Logger';
import {GcpSeverity, GCP_RESOURCE_TYPES} from '../../../src/types/gcp';

describe('GcpLogEntryBuilder', () => {
  let builder: GcpLogEntryBuilder;
  let testLogEntry: LogEntry;

  beforeEach(() => {
    builder = new GcpLogEntryBuilder();
    testLogEntry = {
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
          stack:
            'Error: Connection timeout\n    at Database.connect (db.ts:15:10)',
          code: 'ECONNREFUSED',
        },
      },
    };
  });

  describe('basic GCP LogEntry transformation', () => {
    it('should transform LogEntry to GCP format', () => {
      const gcpEntry = builder.buildGcpLogEntry(testLogEntry);

      expect(gcpEntry.severity).toBe(GcpSeverity.ERROR);
      expect(gcpEntry.timestamp).toBe('2025-07-08T15:52:08.172Z');
      expect(gcpEntry.jsonPayload).toBeDefined();
      expect(gcpEntry.labels).toBeDefined();
      expect(gcpEntry.sourceLocation).toBeDefined();
    });

    it('should include jsonPayload for structured context', () => {
      const gcpEntry = builder.buildGcpLogEntry(testLogEntry);

      expect(gcpEntry.jsonPayload).toBeDefined();
      if (gcpEntry.jsonPayload) {
        expect(gcpEntry.jsonPayload.message).toBe('Database connection failed');
        expect(gcpEntry.jsonPayload.context).toEqual({
          userId: 12345,
          operation: 'user_login',
          retryCount: 3,
        });
        expect(gcpEntry.jsonPayload.error).toBeDefined();
      }
    });

    it('should include labels from context and metadata', () => {
      const gcpEntry = builder.buildGcpLogEntry(testLogEntry);

      expect(gcpEntry.labels).toBeDefined();
      if (gcpEntry.labels) {
        expect(gcpEntry.labels.scope).toBe('auth-service');
        expect(gcpEntry.labels.filename).toBe('auth.ts');
        expect(gcpEntry.labels.error_type).toBe('ConnectionError');
        expect(gcpEntry.labels.context_userid).toBe('12345');
        expect(gcpEntry.labels.context_operation).toBe('user_login');
        expect(gcpEntry.labels.context_retrycount).toBe('3');
      }
    });

    it('should include source location when filename is present', () => {
      const gcpEntry = builder.buildGcpLogEntry(testLogEntry);

      expect(gcpEntry.sourceLocation).toBeDefined();
      if (gcpEntry.sourceLocation) {
        expect(gcpEntry.sourceLocation.file).toBe('auth.ts');
      }
    });
  });

  describe('resource configuration', () => {
    it('should include resource information when configured', () => {
      const resourceBuilder = new GcpLogEntryBuilder({
        resource: {
          type: GCP_RESOURCE_TYPES.GCE_INSTANCE,
          labels: {
            instance_id: '123456789',
            zone: 'us-central1-a',
            project_id: 'my-project-123',
          },
        },
      });

      const gcpEntry = resourceBuilder.buildGcpLogEntry(testLogEntry);

      expect(gcpEntry.resource).toBeDefined();
      if (gcpEntry.resource) {
        expect(gcpEntry.resource.type).toBe(GCP_RESOURCE_TYPES.GCE_INSTANCE);
        expect(gcpEntry.resource.labels).toEqual({
          instance_id: '123456789',
          zone: 'us-central1-a',
          project_id: 'my-project-123',
        });
      }
    });

    it('should include additional labels from options', () => {
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

      const gcpEntry = resourceBuilder.buildGcpLogEntry(testLogEntry);

      expect(gcpEntry.labels).toBeDefined();
      if (gcpEntry.labels) {
        expect(gcpEntry.labels.environment).toBe('production');
        expect(gcpEntry.labels.service).toBe('auth-api');
      }
    });
  });

  describe('text payload for simple messages', () => {
    it('should use textPayload for simple messages without structured context', () => {
      const simpleLogEntry: LogEntry = {
        level: 'INFO',
        timestamp: '2025-07-08T15:52:08.172Z',
        message: 'User logged in successfully',
        metadata: {
          context: 'user_id: 12345',
          scope: {value: 'auth-service'},
        },
      };

      const gcpEntry = builder.buildGcpLogEntry(simpleLogEntry);

      expect(gcpEntry.textPayload).toBeDefined();
      expect(gcpEntry.jsonPayload).toBeUndefined();
      expect(gcpEntry.textPayload).toContain('User logged in successfully');
      expect(gcpEntry.textPayload).toContain('user_id: 12345');
    });

    it('should handle string context in textPayload', () => {
      const simpleLogEntry: LogEntry = {
        level: 'INFO',
        timestamp: '2025-07-08T15:52:08.172Z',
        message: 'Simple message',
        metadata: {
          context: 'string context',
          scope: undefined,
        },
      };

      const gcpEntry = builder.buildGcpLogEntry(simpleLogEntry);

      expect(gcpEntry.textPayload).toContain('Simple message');
      expect(gcpEntry.textPayload).toContain('string context');
    });
  });

  describe('error handling', () => {
    it('should handle errors without context', () => {
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

      const gcpEntry = builder.buildGcpLogEntry(errorLogEntry);

      expect(gcpEntry.severity).toBe(GcpSeverity.CRITICAL);
      expect(gcpEntry.textPayload).toContain('System failure');
      expect(gcpEntry.textPayload).toContain('Error: SystemError');
      expect(gcpEntry.textPayload).toContain('Error: Out of memory');
    });

    it('should include error information in jsonPayload', () => {
      const gcpEntry = builder.buildGcpLogEntry(testLogEntry);

      expect(gcpEntry.jsonPayload).toBeDefined();
      if (gcpEntry.jsonPayload && gcpEntry.jsonPayload.error) {
        const error = gcpEntry.jsonPayload.error as any;
        expect(error.name).toBe('ConnectionError');
        expect(error.stack).toBe(
          'Error: Connection timeout\n    at Database.connect (db.ts:15:10)',
        );
        expect(error.code).toBe('ECONNREFUSED');
      }
    });
  });

  describe('severity mapping', () => {
    it('should map all log levels to correct GCP severities', () => {
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

        const gcpEntry = builder.buildGcpLogEntry(testEntry);
        expect(gcpEntry.severity).toBe(expected);
      });
    });

    it('should use DEFAULT severity for unknown levels', () => {
      const unknownEntry: LogEntry = {
        level: 'UNKNOWN_LEVEL',
        timestamp: '2025-07-08T15:52:08.172Z',
        message: 'Test message',
        metadata: {
          context: undefined,
          scope: undefined,
        },
      };

      const gcpEntry = builder.buildGcpLogEntry(unknownEntry);
      expect(gcpEntry.severity).toBe(GcpSeverity.DEFAULT);
    });
  });

  describe('source location configuration', () => {
    it('should disable source location when configured', () => {
      const noSourceBuilder = new GcpLogEntryBuilder({
        enableSourceLocation: false,
      });

      const gcpEntry = noSourceBuilder.buildGcpLogEntry(testLogEntry);
      expect(gcpEntry.sourceLocation).toBeUndefined();
    });

    it('should not include source location when filename is missing', () => {
      const entryWithoutFilename: LogEntry = {
        ...testLogEntry,
        metadata: {
          ...testLogEntry.metadata,
          filename: undefined,
        },
      };

      const gcpEntry = builder.buildGcpLogEntry(entryWithoutFilename);
      expect(gcpEntry.sourceLocation).toBeUndefined();
    });
  });

  describe('label flattening', () => {
    it('should flatten nested objects into labels', () => {
      const nestedEntry: LogEntry = {
        level: 'INFO',
        timestamp: '2025-07-08T15:52:08.172Z',
        message: 'Test message',
        metadata: {
          context: {
            user: {
              id: 123,
              name: 'John Doe',
            },
            settings: {
              theme: 'dark',
            },
          },
          scope: undefined,
        },
      };

      const gcpEntry = builder.buildGcpLogEntry(nestedEntry);

      expect(gcpEntry.labels).toBeDefined();
      if (gcpEntry.labels) {
        expect(gcpEntry.labels.context_user_id).toBe('123');
        expect(gcpEntry.labels.context_user_name).toBe('John Doe');
        expect(gcpEntry.labels.context_settings_theme).toBe('dark');
      }
    });

    it('should handle null and undefined values in labels', () => {
      const nullEntry: LogEntry = {
        level: 'INFO',
        timestamp: '2025-07-08T15:52:08.172Z',
        message: 'Test message',
        metadata: {
          context: {
            nullValue: null,
            undefinedValue: undefined,
            stringValue: 'test',
          },
          scope: undefined,
        },
      };

      const gcpEntry = builder.buildGcpLogEntry(nullEntry);

      expect(gcpEntry.labels).toBeDefined();
      if (gcpEntry.labels) {
        expect(gcpEntry.labels.context_nullvalue).toBe('null');
        expect(gcpEntry.labels.context_undefinedvalue).toBe('undefined');
        expect(gcpEntry.labels.context_stringvalue).toBe('test');
      }
    });
  });
});
