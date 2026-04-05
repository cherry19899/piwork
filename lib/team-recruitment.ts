import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'co-founder' | 'community-manager' | 'moderator' | 'advisor';
  skills: string[];
  languages: string[];
  status: 'active' | 'onboarding' | 'inactive';
  joinDate: Date;
  compensation: {
    type: 'pi' | 'fiat' | 'equity';
    amount: number;
    currency: string;
    paymentSchedule: string;
  };
  hoursPerWeek: number;
  timezone: string;
  notes: string;
}

export interface JobPosting {
  id: string;
  role: 'technical-cofounder' | 'community-manager' | 'arbitration-moderator';
  description: string;
  requirements: string[];
  compensation: {
    type: string;
    amount: number;
    details: string;
  };
  targetLanguages: string[];
  hoursPerWeek: number;
  deadline: Date;
  status: 'open' | 'closed';
  applicants: number;
}

class TeamRecruitmentService {
  async postJobOpening(posting: Omit<JobPosting, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'team', 'recruitment', 'postings'), {
      ...posting,
      deadline: Timestamp.fromDate(posting.deadline),
      status: 'open',
      applicants: 0,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  }

  async addTeamMember(member: Omit<TeamMember, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'team', 'members', 'roster'), {
      ...member,
      joinDate: Timestamp.fromDate(member.joinDate),
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  }

  async getTeamRoster(): Promise<TeamMember[]> {
    const q = query(collection(db, 'team', 'members', 'roster'), where('status', '==', 'active'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      joinDate: doc.data().joinDate.toDate(),
    })) as TeamMember[];
  }

  async getTeamByRole(role: string): Promise<TeamMember[]> {
    const q = query(
      collection(db, 'team', 'members', 'roster'),
      where('role', '==', role),
      where('status', '==', 'active')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      joinDate: doc.data().joinDate.toDate(),
    })) as TeamMember[];
  }

  async updateTeamMember(memberId: string, updates: Partial<TeamMember>): Promise<void> {
    const memberRef = doc(db, 'team', 'members', 'roster', memberId);
    await updateDoc(memberRef, updates);
  }

  async trackCompensationPayment(
    memberId: string,
    amount: number,
    period: string
  ): Promise<void> {
    await addDoc(collection(db, 'team', 'payments', 'history'), {
      memberId,
      amount,
      period,
      paidAt: Timestamp.now(),
      currency: 'Pi',
    });
  }
}

export const teamRecruitment = new TeamRecruitmentService();
