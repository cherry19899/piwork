'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { KYCService } from '@/lib/pi-sdk-service';
import { AlertCircle, CheckCircle2, Loader2, Shield } from 'lucide-react';

interface KYCFormProps {
  userId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function KYCVerificationForm({ userId, onSuccess, onError }: KYCFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    nationality: '',
    idType: 'national_id' as const,
    idNumber: '',
    proofOfAddress: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({
    type: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const validation = KYCService.validateKYCData(formData);

      if (!validation.valid) {
        setStatus({
          type: 'error',
          message: validation.errors.join(', '),
        });
        setIsLoading(false);
        return;
      }

      console.log('[v0] Submitting KYC verification for user:', userId);

      const result = await KYCService.submitKYCVerification({
        userId,
        ...formData,
      });

      if (result.success) {
        setStatus({
          type: 'success',
          message: result.message,
        });
        setFormData({
          fullName: '',
          dateOfBirth: '',
          nationality: '',
          idType: 'national_id',
          idNumber: '',
          proofOfAddress: '',
        });

        if (onSuccess) {
          onSuccess();
        }
      } else {
        setStatus({
          type: 'error',
          message: result.message,
        });

        if (onError) {
          onError(new Error(result.message));
        }
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setStatus({
        type: 'error',
        message: `KYC submission failed: ${err.message}`,
      });

      if (onError) {
        onError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-card border-border p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-accent" />
        <h3 className="font-bold text-foreground">Verify Your Identity</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Full Name */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1 block">Full Name</label>
          <Input
            type="text"
            value={formData.fullName}
            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="Your full name"
            disabled={isLoading}
            className="bg-background border-border"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1 block">Date of Birth</label>
          <Input
            type="date"
            value={formData.dateOfBirth}
            onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
            disabled={isLoading}
            className="bg-background border-border"
          />
        </div>

        {/* Nationality */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1 block">Nationality</label>
          <Input
            type="text"
            value={formData.nationality}
            onChange={e => setFormData({ ...formData, nationality: e.target.value })}
            placeholder="Your country"
            disabled={isLoading}
            className="bg-background border-border"
          />
        </div>

        {/* ID Type */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1 block">ID Type</label>
          <select
            value={formData.idType}
            onChange={e => setFormData({ ...formData, idType: e.target.value as any })}
            disabled={isLoading}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm"
          >
            <option value="national_id">National ID</option>
            <option value="passport">Passport</option>
            <option value="driver_license">Driver&apos;s License</option>
          </select>
        </div>

        {/* ID Number */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1 block">ID Number</label>
          <Input
            type="text"
            value={formData.idNumber}
            onChange={e => setFormData({ ...formData, idNumber: e.target.value })}
            placeholder="Your ID number"
            disabled={isLoading}
            className="bg-background border-border"
          />
        </div>

        {/* Proof of Address */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1 block">
            Proof of Address (File ID/URL)
          </label>
          <Input
            type="text"
            value={formData.proofOfAddress}
            onChange={e => setFormData({ ...formData, proofOfAddress: e.target.value })}
            placeholder="URL or file reference"
            disabled={isLoading}
            className="bg-background border-border"
          />
        </div>

        {/* Status Message */}
        {status.message && (
          <div
            className={`flex items-start gap-2 p-3 rounded-lg ${
              status.type === 'success'
                ? 'bg-green-500/10 border border-green-500/20'
                : 'bg-red-500/10 border border-red-500/20'
            }`}
          >
            {status.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            )}
            <p className={`text-xs ${status.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
              {status.message}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              Verify Identity
            </>
          )}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground text-center">
        Your information is secure and encrypted. We comply with KYC regulations.
      </p>
    </Card>
  );
}
