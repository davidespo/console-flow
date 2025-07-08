import {GcpResource, GCP_RESOURCE_TYPES} from '../types/gcp';

export interface GcpEnvironmentInfo {
  projectId?: string;
  region?: string;
  zone?: string;
  serviceAccount?: string;
  instanceId?: string;
  clusterName?: string;
  namespace?: string;
  podName?: string;
  containerName?: string;
  revisionName?: string;
  functionName?: string;
  versionId?: string;
}

export class GcpResourceDetector {
  /**
   * Detect GCP resource information from environment
   */
  static detectResource(): GcpResource | null {
    const env = this.getEnvironmentInfo();

    // Detect GCE Instance
    if (env.instanceId) {
      return {
        type: GCP_RESOURCE_TYPES.GCE_INSTANCE,
        labels: {
          instance_id: env.instanceId,
          zone: env.zone || 'unknown',
          project_id: env.projectId || 'unknown',
        },
      };
    }

    // Detect GKE Container
    if (env.clusterName && env.podName) {
      return {
        type: GCP_RESOURCE_TYPES.GKE_CONTAINER,
        labels: {
          cluster_name: env.clusterName,
          namespace_name: env.namespace || 'default',
          pod_name: env.podName,
          container_name: env.containerName || 'main',
          project_id: env.projectId || 'unknown',
          location: env.zone || env.region || 'unknown',
        },
      };
    }

    // Detect Cloud Run Revision
    if (env.revisionName) {
      return {
        type: GCP_RESOURCE_TYPES.CLOUD_RUN_REVISION,
        labels: {
          service_name: env.revisionName.split('-')[0] || 'unknown',
          revision_name: env.revisionName,
          configuration_name: env.revisionName.split('-')[0] || 'unknown',
          project_id: env.projectId || 'unknown',
          location: env.region || 'unknown',
        },
      };
    }

    // Detect Cloud Function
    if (env.functionName) {
      return {
        type: GCP_RESOURCE_TYPES.CLOUD_FUNCTION,
        labels: {
          function_name: env.functionName,
          project_id: env.projectId || 'unknown',
          region: env.region || 'unknown',
        },
      };
    }

    // Detect App Engine
    if (env.versionId) {
      return {
        type: GCP_RESOURCE_TYPES.APP_ENGINE_VERSION,
        labels: {
          module_id: env.functionName || 'default',
          version_id: env.versionId,
          project_id: env.projectId || 'unknown',
        },
      };
    }

    return null;
  }

  /**
   * Get environment information from various sources
   */
  private static getEnvironmentInfo(): GcpEnvironmentInfo {
    const info: GcpEnvironmentInfo = {};

    // Project ID
    info.projectId =
      process.env.GOOGLE_CLOUD_PROJECT ||
      process.env.GCLOUD_PROJECT ||
      this.extractProjectIdFromMetadata();

    // GCE Instance
    if (process.env.GCE_INSTANCE_ID) {
      info.instanceId = process.env.GCE_INSTANCE_ID;
    }
    if (process.env.GCE_INSTANCE_ZONE) {
      info.zone = process.env.GCE_INSTANCE_ZONE.split('/').pop();
    }

    // GKE Container
    if (process.env.KUBERNETES_SERVICE_HOST) {
      info.clusterName = process.env.GKE_CLUSTER_NAME || 'unknown';
      info.namespace = process.env.KUBERNETES_NAMESPACE || 'default';
      info.podName = process.env.HOSTNAME || process.env.KUBERNETES_POD_NAME;
      info.containerName = process.env.KUBERNETES_CONTAINER_NAME || 'main';
    }

    // Cloud Run
    if (process.env.K_REVISION) {
      info.revisionName = process.env.K_REVISION;
    }
    if (process.env.K_SERVICE) {
      info.functionName = process.env.K_SERVICE;
    }
    if (process.env.K_REGION) {
      info.region = process.env.K_REGION;
    }

    // Cloud Functions
    if (process.env.FUNCTION_NAME) {
      info.functionName = process.env.FUNCTION_NAME;
    }
    if (process.env.FUNCTION_REGION) {
      info.region = process.env.FUNCTION_REGION;
    }

    // App Engine
    if (process.env.GAE_VERSION) {
      info.versionId = process.env.GAE_VERSION;
    }
    if (process.env.GAE_SERVICE) {
      info.functionName = process.env.GAE_SERVICE;
    }

    // Service Account
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      info.serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    }

    return info;
  }

  /**
   * Extract project ID from metadata server (simplified)
   */
  private static extractProjectIdFromMetadata(): string | undefined {
    // In a real implementation, this would make an HTTP request to
    // http://metadata.google.internal/computeMetadata/v1/project/project-id
    // For now, we'll return undefined
    return undefined;
  }

  /**
   * Get default labels based on environment
   */
  static getDefaultLabels(): Record<string, string> {
    const env = this.getEnvironmentInfo();
    const labels: Record<string, string> = {};

    if (env.projectId) {
      labels.project_id = env.projectId;
    }
    if (env.region) {
      labels.region = env.region;
    }
    if (env.zone) {
      labels.zone = env.zone;
    }

    // Add environment type
    if (process.env.NODE_ENV) {
      labels.environment = process.env.NODE_ENV;
    }

    // Add service name
    if (process.env.npm_package_name) {
      labels.service = process.env.npm_package_name;
    }

    return labels;
  }

  /**
   * Check if running in GCP environment
   */
  static isGcpEnvironment(): boolean {
    return !!(
      process.env.GOOGLE_CLOUD_PROJECT ||
      process.env.GCE_INSTANCE_ID ||
      process.env.K_REVISION ||
      process.env.FUNCTION_NAME ||
      process.env.GAE_VERSION
    );
  }
}
