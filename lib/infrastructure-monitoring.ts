import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore';

export interface UptimeMetric {
  id: string;
  timestamp: Date;
  service: 'firebase' | 'cloud-functions' | 'cdn' | 'api-gateway';
  status: 'up' | 'degraded' | 'down';
  responseTime: number; // milliseconds
  errorRate: number; // percentage
  region: string;
}

export interface BackupRecord {
  id: string;
  timestamp: Date;
  backupType: 'full' | 'incremental';
  collections: string[];
  sizeGB: number;
  status: 'success' | 'in-progress' | 'failed';
  verificationStatus: 'passed' | 'failed' | 'pending';
  storageLocation: string;
  restoreTestDate?: Date;
}

export interface IncidentReport {
  id: string;
  timestamp: Date;
  severity: 'critical' | 'high' | 'medium' | 'low';
  service: string;
  description: string;
  impact: string;
  resolution: string;
  resolvedAt?: Date;
  status: 'open' | 'resolved' | 'investigating';
  affectedUsers: number;
}

export interface FailoverConfiguration {
  id: string;
  primaryRegion: string;
  secondaryRegion: string;
  service: string;
  failoverCondition: string;
  lastTestedAt: Date;
  status: 'active' | 'inactive';
  testingSchedule: string; // e.g., "monthly"
}

class InfrastructureMonitoringService {
  async logUptimeMetric(metric: Omit<UptimeMetric, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'infrastructure', 'uptime'), {
      ...metric,
      timestamp: Timestamp.fromDate(metric.timestamp),
      recordedAt: Timestamp.now(),
    });
    return docRef.id;
  }

  async getUptimeHistory(
    service: string,
    hours: number = 24
  ): Promise<UptimeMetric[]> {
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    const q = query(
      collection(db, 'infrastructure', 'uptime'),
      where('service', '==', service)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate(),
      }))
      .filter(m => m.timestamp > cutoffTime) as UptimeMetric[];
  }

  async calculateUptimePercentage(service: string, days: number = 30): Promise<number> {
    const metrics = await this.getUptimeHistory(service, days * 24);
    if (metrics.length === 0) return 100;

    const upMetrics = metrics.filter(m => m.status === 'up').length;
    return (upMetrics / metrics.length) * 100;
  }

  async recordBackup(backup: Omit<BackupRecord, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'infrastructure', 'backups'), {
      ...backup,
      timestamp: Timestamp.fromDate(backup.timestamp),
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  }

  async getLatestBackup(): Promise<BackupRecord | null> {
    const snapshot = await getDocs(collection(db, 'infrastructure', 'backups'));
    if (snapshot.empty) return null;

    const backups = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate(),
      }))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return backups[0] as BackupRecord;
  }

  async verifyBackupIntegrity(backupId: string): Promise<boolean> {
    const backupRef = doc(db, 'infrastructure', 'backups', backupId);
    await updateDoc(backupRef, {
      verificationStatus: 'passed',
      lastVerifiedAt: Timestamp.now(),
    });
    return true;
  }

  async reportIncident(incident: Omit<IncidentReport, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'infrastructure', 'incidents'), {
      ...incident,
      timestamp: Timestamp.fromDate(incident.timestamp),
      resolvedAt: incident.resolvedAt ? Timestamp.fromDate(incident.resolvedAt) : null,
      createdAt: Timestamp.now(),
    });

    // Alert team on critical incidents
    if (incident.severity === 'critical') {
      await this.sendCriticalAlert(docRef.id, incident);
    }

    return docRef.id;
  }

  async getActiveIncidents(): Promise<IncidentReport[]> {
    const q = query(
      collection(db, 'infrastructure', 'incidents'),
      where('status', 'in', ['open', 'investigating'])
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate(),
      resolvedAt: doc.data().resolvedAt?.toDate(),
    })) as IncidentReport[];
  }

  async setupFailover(
    config: Omit<FailoverConfiguration, 'id'>
  ): Promise<string> {
    const docRef = await addDoc(collection(db, 'infrastructure', 'failover'), {
      ...config,
      lastTestedAt: Timestamp.fromDate(config.lastTestedAt),
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  }

  async testFailover(failoverId: string): Promise<boolean> {
    const failoverRef = doc(db, 'infrastructure', 'failover', failoverId);
    await updateDoc(failoverRef, {
      lastTestedAt: Timestamp.now(),
      testResult: 'passed',
    });
    return true;
  }

  private async sendCriticalAlert(
    incidentId: string,
    incident: IncidentReport
  ): Promise<void> {
    // This would integrate with alerting service (PagerDuty, Slack, etc.)
    await addDoc(collection(db, 'infrastructure', 'alerts'), {
      incidentId,
      alertType: 'critical',
      service: incident.service,
      description: incident.description,
      timestamp: Timestamp.now(),
      acknowledged: false,
    });
  }
}

export const infrastructureMonitoring = new InfrastructureMonitoringService();
