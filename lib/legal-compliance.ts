import { db } from './firebase';
import { collection, addDoc, query, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore';

export interface LegalEntity {
  id: string;
  name: string;
  jurisdiction: 'singapore' | 'dubai' | 'other';
  registrationNumber: string;
  registrationDate: Date;
  status: 'registered' | 'pending' | 'inactive';
  directors: string[];
  bankAccount?: {
    bank: string;
    accountNumber: string;
    swift: string;
    currency: string;
    status: 'active' | 'pending';
  };
  documents: {
    certificateOfIncorporation: string;
    memorandumOfAssociation: string;
    directorIdentification: string;
    bankAccountOpening: string;
  };
}

export interface ComplianceRequirement {
  id: string;
  jurisdiction: string;
  requirement: string;
  category: 'pi-token' | 'payment-processing' | 'data-protection' | 'reporting';
  status: 'compliant' | 'in-progress' | 'non-compliant';
  deadline?: Date;
  notes: string;
  lastUpdated: Date;
}

export interface CyberInsurance {
  id: string;
  provider: string;
  policyNumber: string;
  coverage: {
    escrowBreach: number;
    dataLoss: number;
    cyberAttack: number;
    coverageTotal: number;
  };
  premium: number;
  premiumCurrency: string;
  startDate: Date;
  expiryDate: Date;
  status: 'active' | 'expired' | 'pending';
}

class LegalComplianceService {
  async registerLegalEntity(entity: Omit<LegalEntity, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'legal', 'entities'), {
      ...entity,
      registrationDate: Timestamp.fromDate(entity.registrationDate),
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  }

  async setupBankAccount(
    entityId: string,
    bankDetails: LegalEntity['bankAccount']
  ): Promise<void> {
    const entityRef = doc(db, 'legal', 'entities', entityId);
    await updateDoc(entityRef, {
      bankAccount: {
        ...bankDetails,
        setupDate: Timestamp.now(),
      },
    });
  }

  async addComplianceRequirement(
    requirement: Omit<ComplianceRequirement, 'id'>
  ): Promise<string> {
    const docRef = await addDoc(collection(db, 'legal', 'compliance'), {
      ...requirement,
      deadline: requirement.deadline ? Timestamp.fromDate(requirement.deadline) : null,
      lastUpdated: Timestamp.fromDate(requirement.lastUpdated),
    });
    return docRef.id;
  }

  async getComplianceByJurisdiction(jurisdiction: string): Promise<ComplianceRequirement[]> {
    const q = query(collection(db, 'legal', 'compliance'));
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        deadline: doc.data().deadline?.toDate(),
        lastUpdated: doc.data().lastUpdated.toDate(),
      }))
      .filter(req => req.jurisdiction === jurisdiction) as ComplianceRequirement[];
  }

  async addCyberInsurance(insurance: Omit<CyberInsurance, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'legal', 'insurance'), {
      ...insurance,
      startDate: Timestamp.fromDate(insurance.startDate),
      expiryDate: Timestamp.fromDate(insurance.expiryDate),
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  }

  async checkInsuranceCoverage(): Promise<CyberInsurance | null> {
    const snapshot = await getDocs(collection(db, 'legal', 'insurance'));
    const activePolicy = snapshot.docs.find(doc => doc.data().status === 'active');
    return activePolicy
      ? {
          id: activePolicy.id,
          ...activePolicy.data(),
          startDate: activePolicy.data().startDate.toDate(),
          expiryDate: activePolicy.data().expiryDate.toDate(),
        }
      : null;
  }
}

export const legalCompliance = new LegalComplianceService();
