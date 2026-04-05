import { PI_SDK_CONFIG, PI_PAYMENT_CONFIG } from '@/lib/piwork-config';

export interface PiUser {
  uid: string;
  username: string;
  payments_enabled: boolean;
}

export interface PiPaymentRequest {
  amount: number;
  memo: string;
  metadata?: Record<string, any>;
}

export interface PiPaymentResponse {
  identifier: string;
  user_uid: string;
  amount: number;
  memo: string;
  timestamp: string;
  txid: string;
}

export interface KYCData {
  userId: string;
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  idType: 'passport' | 'national_id' | 'driver_license';
  idNumber: string;
  proofOfAddress: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verifiedAt?: Date;
  rejectionReason?: string;
}

interface PiAuthenticationResponse {
  user: PiUser;
  accessToken: string;
}

export class PiPaymentService {
  private static readonly AUTH_TIMEOUT = 30000; // 30 seconds
  private static readonly MAX_AUTH_RETRIES = 3;
  private static authRetryCount = 0;

  static initializePi() {
    // In production, Pi SDK would be initialized here
    // window.Pi will be available globally from Pi SDK script
    if (typeof window !== 'undefined' && (window as any).Pi) {
      const Pi = (window as any).Pi;
      Pi.init({ version: PI_SDK_CONFIG.version });
    }
  }

  static async authenticateUser(): Promise<PiUser | null> {
    try {
      if (typeof window === 'undefined' || !(window as any).Pi) {
        throw new Error('Pi SDK not initialized');
      }

      const Pi = (window as any).Pi;
      const scopes = ['payments', 'wallet_address'];

      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Pi authentication timeout after 30s')), this.AUTH_TIMEOUT)
      );

      // Race between authentication and timeout
      const authPromise = this.executeAuthentication(Pi, scopes);
      const authResponse = (await Promise.race([authPromise, timeoutPromise])) as PiAuthenticationResponse;

      // Check if payments are enabled
      if (!authResponse.user.payments_enabled) {
        console.warn('[v0] Payments not enabled for user:', authResponse.user.uid);
        // User will be redirected to KYC guide in UI
        return authResponse.user;
      }

      this.authRetryCount = 0; // Reset retry count on success
      console.log('[v0] Pi authentication successful:', authResponse.user.uid);
      return authResponse.user;
    } catch (error) {
      this.authRetryCount++;
      console.error('[v0] Pi authentication failed (attempt ' + this.authRetryCount + '/3):', error);

      if (this.authRetryCount < this.MAX_AUTH_RETRIES) {
        console.log('[v0] Retrying authentication...');
        // Wait 1 second before retry
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.authenticateUser();
      }

      // Log to Sentry
      this.logToSentry('auth_error', {
        error: error instanceof Error ? error.message : String(error),
        retries: this.authRetryCount,
      });

      this.authRetryCount = 0;
      return null;
    }
  }

  private static async executeAuthentication(Pi: any, scopes: string[]): Promise<PiAuthenticationResponse> {
    return new Promise((resolve, reject) => {
      Pi.authenticate(scopes, async (auth: any) => {
        try {
          // Validate response structure
          if (!auth?.user?.uid || !auth?.user?.username) {
            throw new Error('Invalid authentication response');
          }

          resolve({
            user: {
              uid: auth.user.uid,
              username: auth.user.username,
              payments_enabled: auth.user.payments_enabled === true,
            },
            accessToken: auth.accessToken,
          });
        } catch (error) {
          reject(error);
        }
      }).catch((err: any) => {
        reject(err);
      });
    });
  }

  static async createPayment(request: PiPaymentRequest): Promise<PiPaymentResponse | null> {
    try {
      if (typeof window === 'undefined' || !(window as any).Pi) {
        throw new Error('Pi SDK not initialized');
      }

      const Pi = (window as any).Pi;

      // Validate memo length (max 100 characters per spec)
      if (!request.memo || request.memo.length === 0 || request.memo.length > 100) {
        throw new Error('Memo must be 1-100 characters');
      }

      // Validate amount
      if (request.amount < PI_PAYMENT_CONFIG.minAmount || request.amount > PI_PAYMENT_CONFIG.maxAmount) {
        throw new Error(
          `Amount must be between ${PI_PAYMENT_CONFIG.minAmount} and ${PI_PAYMENT_CONFIG.maxAmount} Pi`
        );
      }

      // Validate metadata contains task_id if provided
      if (request.metadata && !request.metadata.task_id) {
        console.warn('[v0] Metadata should include task_id for proper tracking');
      }

      console.log('[v0] Creating payment:', { amount: request.amount, memo: request.memo });

      // Create payment with callbacks
      const payment = await Pi.createPayment(
        {
          amount: request.amount,
          memo: request.memo,
          metadata: request.metadata || {},
        },
        {
          onReadyForServerApproval: async (paymentId: string) => {
            console.log('[v0] Payment ready for server approval:', paymentId);
            try {
              // Send data to Firebase Cloud Function for approval
              const approved = await this.approvePaymentOnServer(paymentId, request.metadata);
              console.log('[v0] Server approval completed:', approved);
              return approved;
            } catch (error) {
              console.error('[v0] Server approval failed:', error);
              this.logToSentry('payment_approval_error', {
                paymentId,
                error: error instanceof Error ? error.message : String(error),
              });
              throw error;
            }
          },

          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            console.log('[v0] Payment ready for server completion:', { paymentId, txid });
            try {
              // Verify escrow and complete payment
              const completed = await this.completePaymentOnServer(paymentId, txid, request.metadata);
              console.log('[v0] Server completion finished:', completed);
              return completed;
            } catch (error) {
              console.error('[v0] Server completion failed:', error);
              this.logToSentry('payment_completion_error', {
                paymentId,
                txid,
                error: error instanceof Error ? error.message : String(error),
              });
              throw error;
            }
          },

          onCancel: (paymentId: string) => {
            console.log('[v0] Payment cancelled by user:', paymentId);
            // Unlock task in database
            this.unlockTaskInDatabase(request.metadata?.task_id);
          },

          onError: (error: any, payment?: any) => {
            console.error('[v0] Payment SDK error:', error, payment);
            // Log to Sentry with full context
            this.logToSentry('payment_sdk_error', {
              error: error instanceof Error ? error.message : String(error),
              paymentId: payment?.identifier,
              amount: payment?.amount,
            });
            // Unlock task in database on error
            if (request.metadata?.task_id) {
              this.unlockTaskInDatabase(request.metadata.task_id);
            }
          },
        }
      );

      return payment;
    } catch (error) {
      console.error('[v0] Payment creation failed:', error);
      this.logToSentry('payment_creation_error', {
        error: error instanceof Error ? error.message : String(error),
        amount: request.amount,
      });
      return null;
    }
  }

  private static async unlockTaskInDatabase(taskId?: string) {
    if (!taskId) return;

    try {
      const response = await fetch('/api/tasks/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to unlock task: ${response.statusText}`);
      }

      console.log('[v0] Task unlocked:', taskId);
    } catch (error) {
      console.error('[v0] Error unlocking task:', error);
      this.logToSentry('task_unlock_error', {
        taskId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  static async approvePaymentOnServer(
    paymentId: string,
    metadata?: Record<string, any>
  ): Promise<any> {
    try {
      const response = await fetch('/api/payments/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, metadata }),
      });

      if (!response.ok) {
        throw new Error(`Payment approval failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[v0] Server approval error:', error);
      throw error;
    }
  }

  static async completePaymentOnServer(
    paymentId: string,
    txid: string,
    metadata?: Record<string, any>
  ): Promise<any> {
    try {
      // Validate escrow before completion
      const escrowValid = await this.validateEscrow(paymentId);
      if (!escrowValid) {
        throw new Error('Escrow validation failed');
      }

      const response = await fetch('/api/payments/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, txid, metadata }),
      });

      if (!response.ok) {
        throw new Error(`Payment completion failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[v0] Server completion error:', error);
      throw error;
    }
  }

  private static async validateEscrow(paymentId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/payments/validate-escrow?paymentId=${paymentId}`);
      if (!response.ok) return false;
      const data = await response.json();
      return data.valid === true;
    } catch (error) {
      console.error('[v0] Escrow validation error:', error);
      return false;
    }
  }

  private static logToSentry(
    eventType: string,
    context: Record<string, any>
  ) {
    // In production, send to Sentry
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureMessage(eventType, {
        level: 'warning',
        contexts: { piwork: context },
      });
    } else {
      // Fallback: log to console
      console.warn('[v0] Sentry event:', eventType, context);
    }
  }

  static calculateFeeAmount(amount: number): number {
    return Math.round((amount * PI_PAYMENT_CONFIG.feePercentage) / 100 * 100) / 100;
  }

  static calculateNetAmount(amount: number): number {
    return amount - this.calculateFeeAmount(amount);
  }
}

export class KYCService {
  static async submitKYCVerification(kycData: Partial<KYCData>): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch('/api/kyc/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(kycData),
      });

      if (!response.ok) {
        throw new Error(`KYC submission failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('[v0] KYC submitted:', result);

      return {
        success: true,
        message: 'KYC verification submitted successfully. We will verify your information within 24 hours.',
      };
    } catch (error) {
      console.error('[v0] KYC submission error:', error);
      return {
        success: false,
        message: 'KYC submission failed. Please try again.',
      };
    }
  }

  static async getKYCStatus(userId: string): Promise<KYCData | null> {
    try {
      const response = await fetch(`/api/kyc/status?userId=${userId}`);

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch KYC status: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[v0] KYC status fetch error:', error);
      return null;
    }
  }

  static validateKYCData(data: Partial<KYCData>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.fullName || data.fullName.length < 3) {
      errors.push('Full name must be at least 3 characters');
    }

    if (!data.dateOfBirth) {
      errors.push('Date of birth is required');
    } else {
      const age = new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear();
      if (age < 18) {
        errors.push('You must be at least 18 years old');
      }
    }

    if (!data.idType || !data.idNumber) {
      errors.push('Valid ID information is required');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
