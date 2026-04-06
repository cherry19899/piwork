'use client';

import React, { useState, useCallback } from 'react';
import { PiPaymentService, PiPaymentRequest } from '@/lib/pi-sdk-service';

interface PaymentHandlerProps {
  taskId: string;
  amount: number;
  memo: string;
  onPaymentSuccess?: (txid: string) => void;
  onPaymentError?: (error: string) => void;
  onPaymentCancel?: () => void;
}

interface PaymentState {
  status: 'idle' | 'pending' | 'approval' | 'completion' | 'success' | 'error' | 'cancelled';
  error?: string;
  txid?: string;
  progress?: string;
}

export const PaymentHandler: React.FC<PaymentHandlerProps> = ({
  taskId,
  amount,
  memo,
  onPaymentSuccess,
  onPaymentError,
  onPaymentCancel,
}) => {
  const [paymentState, setPaymentState] = useState<PaymentState>({ status: 'idle' });

  const handleCreatePayment = useCallback(async () => {
    try {
      setPaymentState({ status: 'pending', progress: 'Initiating payment...' });

      // Validate inputs
      if (!taskId) throw new Error('Task ID is required');
      if (amount <= 0) throw new Error('Amount must be greater than 0');
      if (!memo || memo.length === 0 || memo.length > 100) {
        throw new Error('Memo must be 1-100 characters');
      }

      const paymentRequest: PiPaymentRequest = {
        amount,
        memo,
        metadata: {
          task_id: taskId,
          timestamp: new Date().toISOString(),
        },
      };

      setPaymentState({
        status: 'approval',
        progress: 'Waiting for payment approval...',
      });

      const payment = await PiPaymentService.createPayment(paymentRequest);

      if (!payment) {
        throw new Error('Payment creation failed');
      }

      // Payment object contains transaction ID after completion
      if (payment.txid) {
        setPaymentState({
          status: 'success',
          txid: payment.txid,
          progress: 'Payment completed successfully',
        });
        onPaymentSuccess?.(payment.txid);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      setPaymentState({
        status: 'error',
        error: errorMessage,
        progress: errorMessage,
      });
      onPaymentError?.(errorMessage);
    }
  }, [taskId, amount, memo, onPaymentSuccess, onPaymentError]);

  const handleCancelPayment = useCallback(() => {
    setPaymentState({
      status: 'cancelled',
      progress: 'Payment cancelled by user',
    });
    onPaymentCancel?.();
  }, [onPaymentCancel]);

  return (
    <div className="space-y-4">
      {/* Status Display */}
      {paymentState.progress && (
        <div className={`rounded-lg p-3 text-sm ${getStatusStyles(paymentState.status)}`}>
          {getStatusIcon(paymentState.status)}
          {paymentState.progress}
        </div>
      )}

      {/* Error Display */}
      {paymentState.error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          <div className="font-semibold">Payment Error</div>
          <div className="mt-1">{paymentState.error}</div>
        </div>
      )}

      {/* Payment Summary */}
      {(paymentState.status === 'idle' || paymentState.status === 'pending') && (
        <div className="rounded-lg border border-input bg-card p-4">
          <div className="mb-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Task ID</span>
              <span className="font-mono font-medium">{taskId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium">{amount} Pi</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Description</span>
              <span className="max-w-xs truncate text-right">{memo}</span>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleCreatePayment}
              disabled={paymentState.status === 'pending'}
              className="flex-1 rounded bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {paymentState.status === 'pending' ? 'Processing...' : 'Pay Now'}
            </button>
            <button
              onClick={handleCancelPayment}
              disabled={paymentState.status === 'pending'}
              className="flex-1 rounded border border-input px-4 py-2 font-medium hover:bg-accent disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Success Display */}
      {paymentState.status === 'success' && (
        <div className="rounded-lg bg-emerald-50 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-emerald-600">✓</div>
            <div>
              <div className="font-semibold text-emerald-900">Payment Successful</div>
              <div className="mt-1 space-y-1 text-sm text-emerald-700">
                <div>Transaction ID: {paymentState.txid}</div>
                <div>Amount: {amount} Pi</div>
                <div>Status: Completed</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancelled Display */}
      {paymentState.status === 'cancelled' && (
        <div className="rounded-lg bg-amber-50 p-4">
          <div className="text-sm text-amber-700">
            Payment was cancelled. You can try again when ready.
          </div>
          <button
            onClick={() => setPaymentState({ status: 'idle' })}
            className="mt-3 rounded border border-amber-200 px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-100"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

function getStatusStyles(status: PaymentState['status']): string {
  switch (status) {
    case 'pending':
      return 'bg-blue-50 text-blue-700';
    case 'approval':
      return 'bg-blue-50 text-blue-700';
    case 'completion':
      return 'bg-blue-50 text-blue-700';
    case 'success':
      return 'bg-emerald-50 text-emerald-700';
    case 'error':
      return 'bg-red-50 text-red-700';
    case 'cancelled':
      return 'bg-amber-50 text-amber-700';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

function getStatusIcon(status: PaymentState['status']): string {
  switch (status) {
    case 'pending':
      return '⏳ ';
    case 'approval':
      return '⏳ ';
    case 'completion':
      return '⏳ ';
    case 'success':
      return '✓ ';
    case 'error':
      return '✕ ';
    case 'cancelled':
      return '⚠ ';
    default:
      return '';
  }
}
