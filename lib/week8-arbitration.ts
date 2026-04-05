// Week 8: Manual Arbitration MVP
// Dispute opening, file attachment, Telegram notification, admin resolution

export interface Dispute {
  id: string
  taskId: string
  openedBy: string
  reason: string
  attachments: string[]
  status: 'open' | 'resolved'
  decision?: 'client' | 'freelancer'
  createdAt: number
  resolvedAt?: number
}

export class Week8ArbitrationService {
  openDispute(taskId: string, userId: string, reason: string, attachments: string[]) {
    return {
      taskId,
      userId,
      reason,
      attachments,
      status: 'open',
      createdAt: Date.now()
    }
  }

  getDisputeHistory(taskId: string) {
    return { disputes: [] }
  }
}
