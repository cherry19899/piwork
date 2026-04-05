'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PiPaymentService } from '@/lib/pi-sdk-service';
import { Wallet, Loader2 } from 'lucide-react';

interface PaymentButtonProps {
  amount: number;
  memo: string;
  jobId: string;
  onSuccess?: (payment: any) => void;
  onError?: (error: Error) => void;
}

export function PaymentButton({ amount, memo, jobId, onSuccess, onError }: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string>('');

  const handlePayment = async () => {
    setIsLoading(true);
    setStatus('');

    try {
      console.log('[v0] Initiating payment:', { amount, memo, jobId });

      const payment = await PiPaymentService.createPayment({
        amount,
        memo: `${memo} (Job: ${jobId})`,
        metadata: { jobId },
      });

      setStatus('Payment completed successfully!');
      if (onSuccess) {
        onSuccess(payment);
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setStatus(`Payment failed: ${err.message}`);
      console.error('[v0] Payment error:', err);

      if (onError) {
        onError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fee = PiPaymentService.calculateFeeAmount(amount);
  const net = PiPaymentService.calculateNetAmount(amount);

  return (
    <Card className="bg-secondary border-border p-4 space-y-3">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Amount:</span>
          <span className="font-semibold text-foreground">{amount.toFixed(2)} π</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Platform Fee ({PiPaymentService as any}.feePercentage}%):</span>
          <span className="text-muted-foreground">{fee.toFixed(2)} π</span>
        </div>
        <div className="border-t border-border pt-2 flex justify-between text-sm">
          <span className="font-semibold text-foreground">You Receive:</span>
          <span className="font-bold text-accent">{net.toFixed(2)} π</span>
        </div>
      </div>

      <Button
        onClick={handlePayment}
        disabled={isLoading}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4 mr-2" />
            Pay with Pi
          </>
        )}
      </Button>

      {status && (
        <p
          className={`text-xs text-center ${
            status.includes('successfully') ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {status}
        </p>
      )}
    </Card>
  );
}
