// Firestore Collections Schema Definitions

export interface PiWorkUser {
  uid: string;
  username: string;
  kyc_status: 'pending' | 'verified' | 'rejected';
  rating: number; // 0-5
  completed_tasks: number;
  created_at: Date;
  language: string;
  country_code: string;
  avatar_url?: string;
  bio?: string;
  skills?: string[];
  verified_categories?: string[];
}

export interface PiWorkTask {
  task_id: string;
  creator_uid: string;
  title: string;
  description: string;
  category: string;
  budget: number; // in Pi
  deadline: Date;
  status: 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  created_at: Date;
  assigned_to?: string;
  applications?: number;
  completion_date?: Date;
  escrow_status?: 'pending' | 'locked' | 'released';
  tags?: string[];
}

export interface PiWorkMessage {
  message_id: string;
  task_id: string;
  sender_uid: string;
  text: string;
  attachments?: Array<{
    url: string;
    name: string;
    size: number;
    type: string;
  }>;
  timestamp: Date;
  read_status: boolean;
  read_by?: string[];
}

export interface PiWorkApplication {
  application_id: string;
  task_id: string;
  applicant_uid: string;
  message: string;
  created_at: Date;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface PiWorkReview {
  review_id: string;
  deal_id: string;
  reviewer_uid: string;
  reviewee_uid: string;
  rating: number; // 1-5
  comment: string;
  categories: {
    quality: number;
    communication: number;
    speed: number;
    professionalism: number;
  };
  created_at: Date;
  weight: number; // Based on reviewer's rating
}

export interface PiWorkTransaction {
  tx_id: string;
  task_id: string;
  payer_uid: string;
  payee_uid: string;
  amount: number;
  status: 'pending' | 'approved' | 'completed' | 'failed' | 'cancelled';
  pi_txid?: string;
  created_at: Date;
  completed_at?: Date;
  escrow_locked_at?: Date;
}
