import {z} from 'zod';

/**
 * Google Cloud Platform Logging Severity Levels
 * https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#LogSeverity
 */
export enum GcpSeverity {
  DEFAULT = 'DEFAULT',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  NOTICE = 'NOTICE',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
  ALERT = 'ALERT',
  EMERGENCY = 'EMERGENCY',
}

/**
 * GCP Resource Type
 * https://cloud.google.com/logging/docs/reference/v2/rest/v2/MonitoredResource
 */
export interface GcpResource {
  type: string;
  labels: Record<string, string>;
}

/**
 * GCP LogEntry Structure
 * https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry
 */
export interface GcpLogEntry {
  severity: GcpSeverity;
  timestamp: string; // RFC3339 format
  textPayload?: string;
  jsonPayload?: Record<string, unknown>;
  resource?: GcpResource;
  labels?: Record<string, string>;
  trace?: string;
  spanId?: string;
  traceSampled?: boolean;
  sourceLocation?: {
    file?: string;
    line?: string;
    function?: string;
  };
  operation?: {
    id?: string;
    producer?: string;
    first?: boolean;
    last?: boolean;
  };
  httpRequest?: {
    requestMethod?: string;
    requestUrl?: string;
    requestSize?: string;
    status?: number;
    responseSize?: string;
    userAgent?: string;
    remoteIp?: string;
    serverIp?: string;
    referer?: string;
    latency?: string;
    cacheLookup?: boolean;
    cacheHit?: boolean;
    cacheValidatedWithOriginServer?: boolean;
    cacheFillBytes?: string;
    protocol?: string;
  };
}

/**
 * Mapping from console-flow levels to GCP severity levels
 */
export const LEVEL_TO_GCP_SEVERITY: Record<string, GcpSeverity> = {
  SECURITY: GcpSeverity.ALERT,
  CRITICAL: GcpSeverity.CRITICAL,
  ERROR: GcpSeverity.ERROR,
  WARN: GcpSeverity.WARNING,
  SUCCESS: GcpSeverity.INFO,
  INFO: GcpSeverity.INFO,
  DEBUG: GcpSeverity.DEBUG,
  TRACE: GcpSeverity.DEBUG,
  RAINBOW: GcpSeverity.INFO,
};

/**
 * GCP-specific logger options
 */
export const GcpLoggerOptionsSchema = z.object({
  projectId: z.string().optional(),
  resource: z
    .object({
      type: z.string(),
      labels: z.record(z.string()),
    })
    .optional(),
  labels: z.record(z.string()).optional(),
  enableTracing: z.boolean().optional().default(false),
  enableSourceLocation: z.boolean().optional().default(true),
});

export type GcpLoggerOptions = z.infer<typeof GcpLoggerOptionsSchema>;

/**
 * Default GCP resource types
 */
export const GCP_RESOURCE_TYPES = {
  GCE_INSTANCE: 'gce_instance',
  GKE_CONTAINER: 'k8s_container',
  CLOUD_RUN_REVISION: 'cloud_run_revision',
  CLOUD_FUNCTION: 'cloud_function',
  APP_ENGINE_VERSION: 'gae_app',
  CLOUD_SQL_INSTANCE: 'cloudsql_database',
  DATAFLOW_JOB: 'dataflow_job',
  CLOUD_BUILD_BUILD: 'cloud_build',
  CLOUD_TASK_QUEUE: 'cloud_task_queue',
  CLOUD_SCHEDULER_JOB: 'cloud_scheduler_job',
} as const;

export type GcpResourceType =
  (typeof GCP_RESOURCE_TYPES)[keyof typeof GCP_RESOURCE_TYPES];
