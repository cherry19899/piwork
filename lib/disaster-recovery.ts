import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore';

export interface DisasterRecoveryPlan {
  id: string;
  rpo: number; // Recovery Point Objective in minutes
  rto: number; // Recovery Time Objective in minutes
  lastDrilledAt: Date;
  nextDrillDate: Date;
  status: 'active' | 'inactive' | 'testing';
}

export interface BackupSchedule {
  id: string;
  frequency: 'hourly' | 'daily' | 'weekly';
  retentionDays: number;
  verifyAfterBackup: boolean;
  multiRegionReplication: boolean;
  primaryRegion: string;
  secondaryRegions: string[];
  lastBackupTime: Date;
  nextBackupTime: Date;
}

export interface RestoreTest {
  id: string;
  scheduledDate: Date;
  completedDate?: Date;
  backupId: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'failed';
  restoredDataSample: number; // percentage of data verified
  result: 'passed' | 'failed' | 'pending';
  notes: string;
}

class DisasterRecoveryService {
  async setupDisasterRecoveryPlan(
    plan: Omit<DisasterRecoveryPlan, 'id'>
  ): Promise<string> {
    const docRef = await addDoc(collection(db, 'disaster-recovery', 'plans'), {
      ...plan,
      lastDrilledAt: Timestamp.fromDate(plan.lastDrilledAt),
      nextDrillDate: Timestamp.fromDate(plan.nextDrillDate),
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  }

  async setupBackupSchedule(
    schedule: Omit<BackupSchedule, 'id'>
  ): Promise<string> {
    const docRef = await addDoc(collection(db, 'disaster-recovery', 'backup-schedules'), {
      ...schedule,
      primaryRegion: schedule.primaryRegion,
      secondaryRegions: schedule.secondaryRegions,
      lastBackupTime: Timestamp.fromDate(schedule.lastBackupTime),
      nextBackupTime: Timestamp.fromDate(schedule.nextBackupTime),
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  }

  async getBackupSchedules(): Promise<BackupSchedule[]> {
    const snapshot = await getDocs(collection(db, 'disaster-recovery', 'backup-schedules'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      lastBackupTime: doc.data().lastBackupTime.toDate(),
      nextBackupTime: doc.data().nextBackupTime.toDate(),
    })) as BackupSchedule[];
  }

  async scheduleRestoreTest(
    test: Omit<RestoreTest, 'id'>
  ): Promise<string> {
    const docRef = await addDoc(collection(db, 'disaster-recovery', 'restore-tests'), {
      ...test,
      scheduledDate: Timestamp.fromDate(test.scheduledDate),
      completedDate: test.completedDate ? Timestamp.fromDate(test.completedDate) : null,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  }

  async completeRestoreTest(
    testId: string,
    result: 'passed' | 'failed',
    notes: string
  ): Promise<void> {
    const testRef = doc(db, 'disaster-recovery', 'restore-tests', testId);
    await updateDoc(testRef, {
      status: 'completed',
      completedDate: Timestamp.now(),
      result,
      notes,
    });
  }

  async getPendingRestoreTests(): Promise<RestoreTest[]> {
    const q = query(
      collection(db, 'disaster-recovery', 'restore-tests'),
      where('status', 'in', ['scheduled', 'in-progress'])
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      scheduledDate: doc.data().scheduledDate.toDate(),
      completedDate: doc.data().completedDate?.toDate(),
    })) as RestoreTest[];
  }

  async getRecoveryMetrics(): Promise<{
    rpo: number;
    rto: number;
    lastSuccessfulRestore: Date | null;
    backupRedundancy: string[];
  }> {
    const plans = await getDocs(collection(db, 'disaster-recovery', 'plans'));
    const schedules = await getDocs(
      collection(db, 'disaster-recovery', 'backup-schedules')
    );

    let rpo = 1440; // default 24 hours
    let rto = 60; // default 1 hour
    let backupRedundancy: string[] = [];

    if (!plans.empty) {
      const plan = plans.docs[0].data();
      rpo = plan.rpo;
      rto = plan.rto;
    }

    if (!schedules.empty) {
      backupRedundancy = schedules.docs[0].data().secondaryRegions || [];
    }

    return {
      rpo,
      rto,
      lastSuccessfulRestore: new Date(), // Would query actual restore data
      backupRedundancy,
    };
  }
}

export const disasterRecovery = new DisasterRecoveryService();
