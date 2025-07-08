import {
  GcpTracingSupport,
  TraceContext,
} from '../../../src/logger/GcpTracingSupport';

describe('GcpTracingSupport', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment variables before each test
    process.env = {...originalEnv};
  });

  afterAll(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('extractTraceContext', () => {
    it('should extract Cloud Trace environment variables', () => {
      process.env.TRACE_ID = 'test-trace-id-123';
      process.env.SPAN_ID = 'test-span-id-456';
      process.env.TRACE_SAMPLED = 'true';

      const context = GcpTracingSupport.extractTraceContext();

      expect(context).toEqual({
        traceId: 'test-trace-id-123',
        spanId: 'test-span-id-456',
        traceSampled: true,
      });
    });

    it('should extract OpenTelemetry trace context', () => {
      process.env.OTEL_TRACE_ID = 'otel-trace-id-123';
      process.env.OTEL_SPAN_ID = 'otel-span-id-456';

      const context = GcpTracingSupport.extractTraceContext();

      expect(context).toEqual({
        traceId: 'otel-trace-id-123',
        spanId: 'otel-span-id-456',
        traceSampled: undefined,
      });
    });

    it('should parse W3C traceparent header', () => {
      process.env.TRACEPARENT =
        '00-1234567890abcdef1234567890abcdef-1234567890abcdef-01';

      const context = GcpTracingSupport.extractTraceContext();

      expect(context).toEqual({
        traceId: '1234567890abcdef1234567890abcdef',
        spanId: '1234567890abcdef',
        traceSampled: true,
      });
    });

    it('should handle traceparent with sampling disabled', () => {
      process.env.TRACEPARENT =
        '00-1234567890abcdef1234567890abcdef-1234567890abcdef-00';

      const context = GcpTracingSupport.extractTraceContext();

      expect(context).toEqual({
        traceId: '1234567890abcdef1234567890abcdef',
        spanId: '1234567890abcdef',
        traceSampled: false,
      });
    });

    it('should prioritize Cloud Trace over OpenTelemetry', () => {
      process.env.TRACE_ID = 'cloud-trace-id';
      process.env.OTEL_TRACE_ID = 'otel-trace-id';

      const context = GcpTracingSupport.extractTraceContext();

      expect(context.traceId).toBe('cloud-trace-id');
    });

    it('should prioritize Cloud Trace over W3C traceparent', () => {
      process.env.TRACE_ID = 'cloud-trace-id';
      process.env.TRACEPARENT =
        '00-1234567890abcdef1234567890abcdef-1234567890abcdef-01';

      const context = GcpTracingSupport.extractTraceContext();

      expect(context.traceId).toBe('cloud-trace-id');
    });

    it('should return empty context when no trace information is available', () => {
      const context = GcpTracingSupport.extractTraceContext();

      expect(context).toEqual({});
    });
  });

  describe('parseTraceParent', () => {
    it('should parse valid traceparent header', () => {
      const traceParent =
        '00-1234567890abcdef1234567890abcdef-1234567890abcdef-01';

      // Access private method through any
      const result = (GcpTracingSupport as any).parseTraceParent(traceParent);

      expect(result).toEqual({
        traceId: '1234567890abcdef1234567890abcdef',
        spanId: '1234567890abcdef',
        traceSampled: true,
      });
    });

    it('should handle invalid traceparent format', () => {
      const invalidTraceParent = 'invalid-format';

      const result = (GcpTracingSupport as any).parseTraceParent(
        invalidTraceParent,
      );

      expect(result).toBeNull();
    });

    it('should handle invalid trace ID format', () => {
      const traceParent = '00-invalid-trace-id-1234567890abcdef-01';

      const result = (GcpTracingSupport as any).parseTraceParent(traceParent);

      expect(result).toBeNull();
    });

    it('should handle invalid span ID format', () => {
      const traceParent = '00-1234567890abcdef1234567890abcdef-invalid-span-01';

      const result = (GcpTracingSupport as any).parseTraceParent(traceParent);

      expect(result).toBeNull();
    });

    it('should handle traceparent with different trace flags', () => {
      const traceParent =
        '00-1234567890abcdef1234567890abcdef-1234567890abcdef-00';

      const result = (GcpTracingSupport as any).parseTraceParent(traceParent);

      expect(result).toEqual({
        traceId: '1234567890abcdef1234567890abcdef',
        spanId: '1234567890abcdef',
        traceSampled: false,
      });
    });
  });

  describe('generateTestTraceContext', () => {
    it('should generate valid trace context', () => {
      const context = GcpTracingSupport.generateTestTraceContext();

      expect(context.traceId).toBeDefined();
      expect(context.spanId).toBeDefined();
      expect(context.traceSampled).toBe(true);
      expect(context.traceId).toMatch(/^[0-9a-f]{32}$/);
      expect(context.spanId).toMatch(/^[0-9a-f]{16}$/);
    });

    it('should generate different trace contexts on each call', () => {
      const context1 = GcpTracingSupport.generateTestTraceContext();
      const context2 = GcpTracingSupport.generateTestTraceContext();

      expect(context1.traceId).not.toBe(context2.traceId);
      expect(context1.spanId).not.toBe(context2.spanId);
    });
  });

  describe('isTracingAvailable', () => {
    it('should return true when Cloud Trace is available', () => {
      process.env.TRACE_ID = 'test-trace-id';

      const isAvailable = GcpTracingSupport.isTracingAvailable();

      expect(isAvailable).toBe(true);
    });

    it('should return true when OpenTelemetry is available', () => {
      process.env.OTEL_TRACE_ID = 'test-trace-id';

      const isAvailable = GcpTracingSupport.isTracingAvailable();

      expect(isAvailable).toBe(true);
    });

    it('should return true when W3C traceparent is available', () => {
      process.env.TRACEPARENT =
        '00-1234567890abcdef1234567890abcdef-1234567890abcdef-01';

      const isAvailable = GcpTracingSupport.isTracingAvailable();

      expect(isAvailable).toBe(true);
    });

    it('should return false when no tracing is available', () => {
      const isAvailable = GcpTracingSupport.isTracingAvailable();

      expect(isAvailable).toBe(false);
    });
  });

  describe('getGcpTraceContext', () => {
    it('should return GCP format trace context', () => {
      process.env.TRACE_ID = 'test-trace-id-123';
      process.env.SPAN_ID = 'test-span-id-456';
      process.env.GOOGLE_CLOUD_PROJECT = 'test-project';

      const gcpContext = GcpTracingSupport.getGcpTraceContext();

      expect(gcpContext).toEqual({
        trace: 'projects/test-project/traces/test-trace-id-123',
        spanId: 'test-span-id-456',
        traceSampled: undefined,
      });
    });

    it('should use unknown project when GOOGLE_CLOUD_PROJECT is not set', () => {
      process.env.TRACE_ID = 'test-trace-id-123';

      const gcpContext = GcpTracingSupport.getGcpTraceContext();

      expect(gcpContext.trace).toBe(
        'projects/unknown/traces/test-trace-id-123',
      );
    });

    it('should return empty object when no trace ID is available', () => {
      const gcpContext = GcpTracingSupport.getGcpTraceContext();

      expect(gcpContext).toEqual({});
    });

    it('should include trace sampling information', () => {
      process.env.TRACE_ID = 'test-trace-id-123';
      process.env.TRACE_SAMPLED = 'true';

      const gcpContext = GcpTracingSupport.getGcpTraceContext();

      expect(gcpContext.traceSampled).toBe(true);
    });
  });

  describe('trace ID and span ID generation', () => {
    it('should generate valid trace IDs', () => {
      const traceId1 = (GcpTracingSupport as any).generateTraceId();
      const traceId2 = (GcpTracingSupport as any).generateTraceId();

      expect(traceId1).toMatch(/^[0-9a-f]{32}$/);
      expect(traceId2).toMatch(/^[0-9a-f]{32}$/);
      expect(traceId1).not.toBe(traceId2);
    });

    it('should generate valid span IDs', () => {
      const spanId1 = (GcpTracingSupport as any).generateSpanId();
      const spanId2 = (GcpTracingSupport as any).generateSpanId();

      expect(spanId1).toMatch(/^[0-9a-f]{16}$/);
      expect(spanId2).toMatch(/^[0-9a-f]{16}$/);
      expect(spanId1).not.toBe(spanId2);
    });
  });
});
