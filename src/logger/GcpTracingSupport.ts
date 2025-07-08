/**
 * GCP Distributed Tracing Support
 * Extracts trace context from various sources including OpenTelemetry
 */

export interface TraceContext {
  traceId?: string;
  spanId?: string;
  traceSampled?: boolean;
}

export class GcpTracingSupport {
  /**
   * Extract trace context from environment variables
   */
  static extractTraceContext(): TraceContext {
    const context: TraceContext = {};

    // Check for Cloud Trace environment variables
    if (process.env.TRACE_ID) {
      context.traceId = process.env.TRACE_ID;
    }
    if (process.env.SPAN_ID) {
      context.spanId = process.env.SPAN_ID;
    }
    if (process.env.TRACE_SAMPLED) {
      context.traceSampled = process.env.TRACE_SAMPLED === 'true';
    }

    // Check for OpenTelemetry trace context
    if (!context.traceId && process.env.OTEL_TRACE_ID) {
      context.traceId = process.env.OTEL_TRACE_ID;
    }
    if (!context.spanId && process.env.OTEL_SPAN_ID) {
      context.spanId = process.env.OTEL_SPAN_ID;
    }

    // Check for W3C trace context header
    if (!context.traceId && process.env.TRACEPARENT) {
      const traceParent = this.parseTraceParent(process.env.TRACEPARENT);
      if (traceParent) {
        context.traceId = traceParent.traceId;
        context.spanId = traceParent.spanId;
        context.traceSampled = traceParent.traceSampled;
      }
    }

    return context;
  }

  /**
   * Parse W3C traceparent header
   * Format: 00-<trace-id>-<span-id>-<trace-flags>
   */
  private static parseTraceParent(traceParent: string): TraceContext | null {
    const parts = traceParent.split('-');
    if (parts.length !== 4) {
      return null;
    }

    const [, traceId, spanId, traceFlags] = parts;

    // Validate trace ID (32 hex characters)
    if (!/^[0-9a-f]{32}$/.test(traceId)) {
      return null;
    }

    // Validate span ID (16 hex characters)
    if (!/^[0-9a-f]{16}$/.test(spanId)) {
      return null;
    }

    // Parse trace flags (last bit indicates sampled)
    const flags = parseInt(traceFlags, 16);
    const sampled = (flags & 1) === 1;

    return {
      traceId,
      spanId,
      traceSampled: sampled,
    };
  }

  /**
   * Generate trace context for testing
   */
  static generateTestTraceContext(): TraceContext {
    return {
      traceId: this.generateTraceId(),
      spanId: this.generateSpanId(),
      traceSampled: true,
    };
  }

  /**
   * Generate a random trace ID (32 hex characters)
   */
  private static generateTraceId(): string {
    return Array.from({length: 32}, () =>
      Math.floor(Math.random() * 16).toString(16),
    ).join('');
  }

  /**
   * Generate a random span ID (16 hex characters)
   */
  private static generateSpanId(): string {
    return Array.from({length: 16}, () =>
      Math.floor(Math.random() * 16).toString(16),
    ).join('');
  }

  /**
   * Check if tracing is available
   */
  static isTracingAvailable(): boolean {
    return !!(
      process.env.TRACE_ID ||
      process.env.OTEL_TRACE_ID ||
      process.env.TRACEPARENT
    );
  }

  /**
   * Get trace context as GCP format
   */
  static getGcpTraceContext(): {
    trace?: string;
    spanId?: string;
    traceSampled?: boolean;
  } {
    const context = this.extractTraceContext();

    if (!context.traceId) {
      return {};
    }

    return {
      trace: `projects/${
        process.env.GOOGLE_CLOUD_PROJECT || 'unknown'
      }/traces/${context.traceId}`,
      spanId: context.spanId,
      traceSampled: context.traceSampled,
    };
  }
}
