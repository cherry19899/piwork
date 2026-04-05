import { Timestamp } from 'firebase/firestore';

export type PaymentPhase = 'pending' | 'approved' | 'completed' | 'cancelled' | 'disputed';
export type PaymentStatus = 'awaiting_approval' | 'locked' | 'released' | 'refunded' | 'in_dispute';

export interface EscrowPayment {
  id: string;
  jobId: string;
  clientId: string;
  workerId: string;
  amount: number;
  piAmount: number;
  platformFee: number;
  phase: PaymentPhase;
  status: PaymentStatus;
  createdAt: Timestamp;
  approvedAt?: Timestamp;
  completedAt?: Timestamp;
  cancelledAt?: Timestamp;
  expiresAt: Timestamp;
  txHash?: string;
  notes?: string;
}

export interface PaymentApprovalRequest {
  paymentId: string;
  clientId: string;
  piTransactionId: string;
  timestamp: Timestamp;
}

export interface PaymentCompletionRequest {
  paymentId: string;
  workerId: string;
  deliverables: string[];
  piTransactionId: string;
  timestamp: Timestamp;
}

export interface PaymentCancellation {
  paymentId: string;
  reason: string;
  initiatedBy: 'client' | 'worker' | 'system';
  piRefundTxHash: string;
  timestamp: Timestamp;
}

export class EscrowPaymentService {
  private static readonly ESCROW_TIMEOUT = 30 * 24 * 60 * 60 * 1000; // 30 days
  private static readonly PLATFORM_FEE_PERCENTAGE = 0.05; // 5%

  /**
   * Create escrow payment with two-phase confirmation
   * Phase 1: Client approves and Pi is locked
   * Phase 2: Worker completes, client confirms, Pi released
   */
  static createEscrowPayment(
    jobId: string,
    clientId: string,
    workerId: string,
    piAmount: number
  ): EscrowPayment {
    const platformFee = piAmount * this.PLATFORM_FEE_PERCENTAGE;
    const totalAmount = piAmount + platformFee;
    const now = Timestamp.now();
    const expiresAt = new Timestamp(
      now.seconds + (this.ESCROW_TIMEOUT / 1000),
      now.nanoseconds
    );

    return {
      id: `escrow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      jobId,
      clientId,
      workerId,
      amount: totalAmount,
      piAmount,
      platformFee,
      phase: 'pending',
      status: 'awaiting_approval',
      createdAt: now,
      expiresAt,
    };
  }

  /**
   * Phase 1: Client approves payment - Pi is locked in escrow
   */
  static approvePayment(
    payment: EscrowPayment,
    piTransactionId: string
  ): EscrowPayment {
    return {
      ...payment,
      phase: 'approved',
      status: 'locked',
      approvedAt: Timestamp.now(),
      txHash: piTransactionId,
    };
  }

  /**
   * Phase 2: Worker completes work, client confirms - Pi released to worker
   */
  static completePayment(
    payment: EscrowPayment,
    piTransactionId: string
  ): EscrowPayment {
    return {
      ...payment,
      phase: 'completed',
      status: 'released',
      completedAt: Timestamp.now(),
      txHash: piTransactionId,
    };
  }

  /**
   * Cancel payment and return Pi to client
   */
  static cancelPayment(
    payment: EscrowPayment,
    reason: string,
    piRefundTxHash: string
  ): EscrowPayment {
    return {
      ...payment,
      phase: 'cancelled',
      status: 'refunded',
      cancelledAt: Timestamp.now(),
      txHash: piRefundTxHash,
      notes: reason,
    };
  }

  /**
   * Move payment to dispute - Pi remains locked until arbitration resolves
   */
  static disputePayment(payment: EscrowPayment): EscrowPayment {
    return {
      ...payment,
      phase: 'disputed',
      status: 'in_dispute',
    };
  }

  /**
   * Verify payment can proceed based on timing and status
   */
  static canApprove(payment: EscrowPayment): boolean {
    return (
      payment.phase === 'pending' &&
      payment.status === 'awaiting_approval' &&
      Timestamp.now().toMillis() < payment.expiresAt.toMillis()
    );
  }

  static canComplete(payment: EscrowPayment): boolean {
    return (
      payment.phase === 'approved' &&
      payment.status === 'locked' &&
      Timestamp.now().toMillis() < payment.expiresAt.toMillis()
    );
  }

  static canCancel(payment: EscrowPayment): boolean {
    return payment.phase !== 'completed' && payment.phase !== 'cancelled';
  }

  static canDispute(payment: EscrowPayment): boolean {
    return payment.phase === 'approved' || payment.phase === 'completed';
  }

  static isExpired(payment: EscrowPayment): boolean {
    return Timestamp.now().toMillis() > payment.expiresAt.toMillis();
  }

  /**
   * Get human-readable status description
   */
  static getStatusDescription(payment: EscrowPayment): string {
    const descriptions: Record<PaymentStatus, string> = {
      awaiting_approval:
        'Waiting for client to approve and lock Pi in escrow',
      locked: 'Pi locked in escrow - waiting for worker to complete',
      released: 'Pi released to worker',
      refunded: 'Pi refunded to client',
      in_dispute: 'Pi locked pending dispute resolution',
    };
    return descriptions[payment.status];
  }
}
