import {LogEntry} from './Logger';
import {
  GcpLogEntry,
  GcpSeverity,
  LEVEL_TO_GCP_SEVERITY,
  GcpResource,
  GcpLoggerOptions,
} from '../types/gcp';
import {ColorStrategy} from '../colors';

export class GcpLogEntryBuilder {
  private readonly options: GcpLoggerOptions;

  constructor(options: Partial<GcpLoggerOptions> = {}) {
    this.options = {
      enableTracing: false,
      enableSourceLocation: true,
      ...options,
    };
  }

  /**
   * Transform console-flow LogEntry to GCP LogEntry
   */
  buildGcpLogEntry(entry: LogEntry): GcpLogEntry {
    const gcpEntry: GcpLogEntry = {
      severity: this.mapSeverity(entry.level),
      timestamp: entry.timestamp,
    };

    // Handle payload (text or JSON)
    this.setPayload(gcpEntry, entry);

    // Set resource information
    if (this.options.resource) {
      gcpEntry.resource = this.options.resource;
    }

    // Set labels
    this.setLabels(gcpEntry, entry);

    // Set source location if enabled
    if (this.options.enableSourceLocation && entry.metadata.filename) {
      gcpEntry.sourceLocation = {
        file: entry.metadata.filename,
      };
    }

    return gcpEntry;
  }

  /**
   * Map console-flow level to GCP severity
   */
  private mapSeverity(level: string): GcpSeverity {
    return LEVEL_TO_GCP_SEVERITY[level] || GcpSeverity.DEFAULT;
  }

  /**
   * Set the appropriate payload (text or JSON)
   */
  private setPayload(gcpEntry: GcpLogEntry, entry: LogEntry): void {
    // Strip colors from message
    const cleanMessage = ColorStrategy.json(entry.message);

    // If we have structured context, use jsonPayload
    if (entry.metadata.context && typeof entry.metadata.context === 'object') {
      gcpEntry.jsonPayload = {
        message: cleanMessage,
        context: entry.metadata.context,
        ...this.extractErrorInfo(entry.metadata.error),
      };
    } else {
      // Use textPayload for simple messages
      let textPayload = cleanMessage;

      // Add context as string if present
      if (entry.metadata.context) {
        const contextStr =
          typeof entry.metadata.context === 'string'
            ? ColorStrategy.json(entry.metadata.context)
            : JSON.stringify(entry.metadata.context);
        textPayload += ` ${contextStr}`;
      }

      // Add error information if present
      if (entry.metadata.error) {
        textPayload += `\nError: ${
          entry.metadata.error.name || 'Unknown Error'
        }`;
        if (entry.metadata.error.stack) {
          textPayload += `\n${ColorStrategy.json(entry.metadata.error.stack)}`;
        }
      }

      gcpEntry.textPayload = textPayload;
    }
  }

  /**
   * Extract error information for structured logging
   */
  private extractErrorInfo(
    error?: LogEntry['metadata']['error'],
  ): Record<string, unknown> {
    if (!error) return {};

    return {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        ...Object.fromEntries(
          Object.entries(error).filter(
            ([key]) => !['name', 'message', 'stack'].includes(key),
          ),
        ),
      },
    };
  }

  /**
   * Set labels from context and options
   */
  private setLabels(gcpEntry: GcpLogEntry, entry: LogEntry): void {
    const labels: Record<string, string> = {};

    // Add labels from options
    if (this.options.labels) {
      Object.assign(labels, this.options.labels);
    }

    // Add scope/prefix as label if present
    if (entry.metadata.scope?.value) {
      labels.scope = entry.metadata.scope.value;
    }

    // Add filename as label if present
    if (entry.metadata.filename) {
      labels.filename = entry.metadata.filename;
    }

    // Add error type as label if present
    if (entry.metadata.error?.name) {
      labels.error_type = entry.metadata.error.name;
    }

    // Flatten context object into labels (for simple key-value pairs)
    if (entry.metadata.context && typeof entry.metadata.context === 'object') {
      this.flattenObjectToLabels(labels, entry.metadata.context, 'context');
    }

    if (Object.keys(labels).length > 0) {
      gcpEntry.labels = labels;
    }
  }

  /**
   * Flatten nested objects into label format
   */
  private flattenObjectToLabels(
    labels: Record<string, string>,
    obj: unknown,
    prefix: string,
    maxDepth: number = 2,
    currentDepth: number = 0,
  ): void {
    if (currentDepth >= maxDepth || !obj || typeof obj !== 'object') {
      return;
    }

    for (const [key, value] of Object.entries(obj)) {
      const labelKey = `${prefix}_${key}`.toLowerCase();

      if (value === null || value === undefined) {
        labels[labelKey] = String(value);
      } else if (typeof value === 'object' && currentDepth < maxDepth - 1) {
        this.flattenObjectToLabels(
          labels,
          value,
          labelKey,
          maxDepth,
          currentDepth + 1,
        );
      } else {
        labels[labelKey] = String(value);
      }
    }
  }

  /**
   * Set resource information
   */
  setResource(resource: GcpResource): void {
    this.options.resource = resource;
  }

  /**
   * Add labels
   */
  addLabels(newLabels: Record<string, string>): void {
    this.options.labels = {...this.options.labels, ...newLabels};
  }
}
