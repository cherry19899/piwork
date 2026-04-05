import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';

export interface AcquisitionLead {
  id?: string;
  contact_type: 'customer' | 'freelancer';
  source: 'facebook' | 'reddit' | 'twitter' | 'direct' | 'referral';
  first_contact_date: Date;
  contact_name: string;
  contact_identifier: string; // Facebook ID, username, email
  country: string;
  
  // Funnel stages with timestamps
  message_sent_at: Date;
  message_responded_at?: Date;
  registration_date?: Date;
  first_task_created_at?: Date;
  first_deal_completed_at?: Date;
  
  // Conversion flags
  responded: boolean;
  registered: boolean;
  task_created: boolean;
  deal_completed: boolean;
  
  // Contact details
  pi_username?: string;
  email?: string;
  phone?: string;
  
  // Rejection tracking
  status: 'active' | 'rejected' | 'converted' | 'dormant';
  rejection_reason?: string;
  rejection_date?: Date;
  
  // Notes
  conversation_notes: string;
  demo_completed: boolean;
  objections_faced: string[];
}

export interface AcquisitionMetrics {
  total_contacts: number;
  messages_sent: number;
  responses: number;
  registrations: number;
  tasks_created: number;
  deals_completed: number;
  
  // Conversion rates
  message_to_response_rate: number; // responses / messages_sent
  response_to_registration_rate: number; // registrations / responses
  registration_to_task_rate: number; // tasks_created / registrations
  task_to_deal_rate: number; // deals_completed / tasks_created
  overall_contact_to_deal_rate: number; // deals_completed / total_contacts
  
  // Time metrics
  avg_response_time_hours: number;
  avg_time_to_registration_hours: number;
  avg_time_to_first_task_hours: number;
  avg_time_to_first_deal_hours: number;
  
  // Rejection analysis
  rejection_count: number;
  rejection_rate: number;
  top_rejection_reasons: { reason: string; count: number }[];
}

export class AcquisitionMetricsService {
  static async trackLead(lead: Omit<AcquisitionLead, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'acquisition_leads'), {
        ...lead,
        first_contact_date: Timestamp.fromDate(lead.first_contact_date),
        message_sent_at: Timestamp.fromDate(lead.message_sent_at),
        message_responded_at: lead.message_responded_at ? Timestamp.fromDate(lead.message_responded_at) : null,
        registration_date: lead.registration_date ? Timestamp.fromDate(lead.registration_date) : null,
        first_task_created_at: lead.first_task_created_at ? Timestamp.fromDate(lead.first_task_created_at) : null,
        first_deal_completed_at: lead.first_deal_completed_at ? Timestamp.fromDate(lead.first_deal_completed_at) : null,
        rejection_date: lead.rejection_date ? Timestamp.fromDate(lead.rejection_date) : null,
      });
      console.log('[v0] Lead tracked:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('[v0] Failed to track lead:', error);
      throw error;
    }
  }

  static async recordResponse(leadId: string): Promise<void> {
    try {
      const leadRef = collection(db, 'acquisition_leads');
      const q = query(leadRef, where('id', '==', leadId));
      const docs = await getDocs(q);
      
      if (docs.empty) throw new Error('Lead not found');
      
      const doc = docs.docs[0];
      await doc.ref.update({
        responded: true,
        message_responded_at: Timestamp.now(),
        status: 'active',
      });
      console.log('[v0] Response recorded for lead:', leadId);
    } catch (error) {
      console.error('[v0] Failed to record response:', error);
      throw error;
    }
  }

  static async recordRegistration(leadId: string, piUsername: string): Promise<void> {
    try {
      const leadRef = collection(db, 'acquisition_leads');
      const q = query(leadRef, where('id', '==', leadId));
      const docs = await getDocs(q);
      
      if (docs.empty) throw new Error('Lead not found');
      
      const doc = docs.docs[0];
      await doc.ref.update({
        registered: true,
        registration_date: Timestamp.now(),
        pi_username: piUsername,
        status: 'active',
      });
      console.log('[v0] Registration recorded for lead:', leadId);
    } catch (error) {
      console.error('[v0] Failed to record registration:', error);
      throw error;
    }
  }

  static async recordTaskCreation(leadId: string): Promise<void> {
    try {
      const leadRef = collection(db, 'acquisition_leads');
      const q = query(leadRef, where('id', '==', leadId));
      const docs = await getDocs(q);
      
      if (docs.empty) throw new Error('Lead not found');
      
      const doc = docs.docs[0];
      await doc.ref.update({
        task_created: true,
        first_task_created_at: Timestamp.now(),
        status: 'active',
      });
      console.log('[v0] Task creation recorded for lead:', leadId);
    } catch (error) {
      console.error('[v0] Failed to record task creation:', error);
      throw error;
    }
  }

  static async recordDealCompletion(leadId: string): Promise<void> {
    try {
      const leadRef = collection(db, 'acquisition_leads');
      const q = query(leadRef, where('id', '==', leadId));
      const docs = await getDocs(q);
      
      if (docs.empty) throw new Error('Lead not found');
      
      const doc = docs.docs[0];
      await doc.ref.update({
        deal_completed: true,
        first_deal_completed_at: Timestamp.now(),
        status: 'converted',
      });
      console.log('[v0] Deal completion recorded for lead:', leadId);
    } catch (error) {
      console.error('[v0] Failed to record deal completion:', error);
      throw error;
    }
  }

  static async recordRejection(leadId: string, reason: string, notes?: string): Promise<void> {
    try {
      const leadRef = collection(db, 'acquisition_leads');
      const q = query(leadRef, where('id', '==', leadId));
      const docs = await getDocs(q);
      
      if (docs.empty) throw new Error('Lead not found');
      
      const doc = docs.docs[0];
      await doc.ref.update({
        status: 'rejected',
        rejection_reason: reason,
        rejection_date: Timestamp.now(),
        conversation_notes: notes || doc.data().conversation_notes,
      });
      console.log('[v0] Rejection recorded for lead:', leadId, 'Reason:', reason);
    } catch (error) {
      console.error('[v0] Failed to record rejection:', error);
      throw error;
    }
  }

  static async getAcquisitionMetrics(contactType?: 'customer' | 'freelancer'): Promise<AcquisitionMetrics> {
    try {
      const leadRef = collection(db, 'acquisition_leads');
      const q = contactType 
        ? query(leadRef, where('contact_type', '==', contactType))
        : leadRef;
      
      const docs = await getDocs(q);
      const leads = docs.docs.map(doc => doc.data() as AcquisitionLead);

      if (leads.length === 0) {
        return this.getEmptyMetrics();
      }

      const metrics = this.calculateMetrics(leads);
      console.log('[v0] Acquisition metrics calculated:', metrics);
      return metrics;
    } catch (error) {
      console.error('[v0] Failed to calculate metrics:', error);
      throw error;
    }
  }

  private static calculateMetrics(leads: AcquisitionLead[]): AcquisitionMetrics {
    const total_contacts = leads.length;
    const messages_sent = leads.filter(l => l.message_sent_at).length;
    const responses = leads.filter(l => l.responded).length;
    const registrations = leads.filter(l => l.registered).length;
    const tasks_created = leads.filter(l => l.task_created).length;
    const deals_completed = leads.filter(l => l.deal_completed).length;
    const rejections = leads.filter(l => l.status === 'rejected');

    // Time calculations
    const responseTimes = leads
      .filter(l => l.message_responded_at && l.message_sent_at)
      .map(l => {
        const sent = new Date(l.message_sent_at).getTime();
        const responded = new Date(l.message_responded_at!).getTime();
        return (responded - sent) / (1000 * 60 * 60); // Convert to hours
      });

    const regTimes = leads
      .filter(l => l.registration_date && l.message_responded_at)
      .map(l => {
        const responded = new Date(l.message_responded_at!).getTime();
        const registered = new Date(l.registration_date!).getTime();
        return (registered - responded) / (1000 * 60 * 60);
      });

    const taskTimes = leads
      .filter(l => l.first_task_created_at && l.registration_date)
      .map(l => {
        const registered = new Date(l.registration_date!).getTime();
        const taskCreated = new Date(l.first_task_created_at!).getTime();
        return (taskCreated - registered) / (1000 * 60 * 60);
      });

    const dealTimes = leads
      .filter(l => l.first_deal_completed_at && l.first_contact_date)
      .map(l => {
        const contact = new Date(l.first_contact_date).getTime();
        const deal = new Date(l.first_deal_completed_at!).getTime();
        return (deal - contact) / (1000 * 60 * 60);
      });

    // Rejection analysis
    const rejectionReasons: { [key: string]: number } = {};
    rejections.forEach(l => {
      if (l.rejection_reason) {
        rejectionReasons[l.rejection_reason] = (rejectionReasons[l.rejection_reason] || 0) + 1;
      }
    });

    const topRejectionReasons = Object.entries(rejectionReasons)
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      total_contacts,
      messages_sent,
      responses,
      registrations,
      tasks_created,
      deals_completed,
      
      message_to_response_rate: messages_sent > 0 ? (responses / messages_sent) * 100 : 0,
      response_to_registration_rate: responses > 0 ? (registrations / responses) * 100 : 0,
      registration_to_task_rate: registrations > 0 ? (tasks_created / registrations) * 100 : 0,
      task_to_deal_rate: tasks_created > 0 ? (deals_completed / tasks_created) * 100 : 0,
      overall_contact_to_deal_rate: total_contacts > 0 ? (deals_completed / total_contacts) * 100 : 0,
      
      avg_response_time_hours: responseTimes.length > 0 
        ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length 
        : 0,
      avg_time_to_registration_hours: regTimes.length > 0
        ? regTimes.reduce((a, b) => a + b, 0) / regTimes.length
        : 0,
      avg_time_to_first_task_hours: taskTimes.length > 0
        ? taskTimes.reduce((a, b) => a + b, 0) / taskTimes.length
        : 0,
      avg_time_to_first_deal_hours: dealTimes.length > 0
        ? dealTimes.reduce((a, b) => a + b, 0) / dealTimes.length
        : 0,
      
      rejection_count: rejections.length,
      rejection_rate: total_contacts > 0 ? (rejections.length / total_contacts) * 100 : 0,
      top_rejection_reasons: topRejectionReasons,
    };
  }

  private static getEmptyMetrics(): AcquisitionMetrics {
    return {
      total_contacts: 0,
      messages_sent: 0,
      responses: 0,
      registrations: 0,
      tasks_created: 0,
      deals_completed: 0,
      message_to_response_rate: 0,
      response_to_registration_rate: 0,
      registration_to_task_rate: 0,
      task_to_deal_rate: 0,
      overall_contact_to_deal_rate: 0,
      avg_response_time_hours: 0,
      avg_time_to_registration_hours: 0,
      avg_time_to_first_task_hours: 0,
      avg_time_to_first_deal_hours: 0,
      rejection_count: 0,
      rejection_rate: 0,
      top_rejection_reasons: [],
    };
  }
}
