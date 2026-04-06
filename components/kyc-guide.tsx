'use client';

import React, { useState } from 'react';
import { KYCService } from '@/lib/pi-sdk-service';

interface KYCGuideProps {
  userId?: string;
  onComplete?: () => void;
}

export const KYCGuide: React.FC<KYCGuideProps> = ({ userId, onComplete }) => {
  const [step, setStep] = useState<'info' | 'form' | 'success' | 'error'>('info');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    nationality: '',
    idType: 'passport' as const,
    idNumber: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate form data
      const validation = KYCService.validateKYCData(formData);
      if (!validation.valid) {
        setError(validation.errors.join(', '));
        setLoading(false);
        return;
      }

      // Submit KYC
      const result = await KYCService.submitKYCVerification({
        userId,
        ...formData,
        proofOfAddress: '', // Would normally be a file upload
        verificationStatus: 'pending',
      });

      if (result.success) {
        setStep('success');
        onComplete?.();
      } else {
        setError(result.message);
        setStep('error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'KYC submission failed');
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container max-w-2xl py-8">
        {/* Info Step */}
        {step === 'info' && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold">KYC Verification Required</h1>
              <p className="mt-2 text-muted-foreground">
                Complete identity verification to enable payments on PiWork
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: '🛡️',
                  title: 'Secure',
                  description: 'Your data is encrypted and securely stored',
                },
                {
                  icon: '⚡',
                  title: 'Fast',
                  description: 'Verification typically completes in 24 hours',
                },
                {
                  icon: '✓',
                  title: 'Required',
                  description: 'Needed to comply with financial regulations',
                },
              ].map((item, i) => (
                <div key={i} className="rounded-lg border border-input bg-card p-4 text-center">
                  <div className="text-3xl">{item.icon}</div>
                  <h3 className="mt-2 font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
              <div className="font-semibold">What you'll need:</div>
              <ul className="mt-2 list-inside space-y-1">
                <li>✓ Valid government-issued ID (passport, national ID, or driver's license)</li>
                <li>✓ Proof of address (utility bill or bank statement)</li>
                <li>✓ 5 minutes of your time</li>
              </ul>
            </div>

            <button
              onClick={() => setStep('form')}
              className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Start Verification
            </button>
          </div>
        )}

        {/* Form Step */}
        {step === 'form' && (
          <div className="rounded-lg border border-input bg-card p-6">
            <h2 className="mb-4 text-xl font-bold">Personal Information</h2>

            {error && (
              <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Your full legal name"
                  className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  required
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium">Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  required
                />
              </div>

              {/* Nationality */}
              <div>
                <label className="block text-sm font-medium">Nationality *</label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  placeholder="Your country"
                  className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  required
                />
              </div>

              {/* ID Type */}
              <div>
                <label className="block text-sm font-medium">ID Type *</label>
                <select
                  name="idType"
                  value={formData.idType}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="passport">Passport</option>
                  <option value="national_id">National ID</option>
                  <option value="driver_license">Driver's License</option>
                </select>
              </div>

              {/* ID Number */}
              <div>
                <label className="block text-sm font-medium">ID Number *</label>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  placeholder="Your ID number"
                  className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  required
                />
              </div>

              {/* Terms */}
              <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                By submitting this form, you agree that the information provided is accurate and
                complete. False information may result in account suspension.
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setStep('info')}
                  className="flex-1 rounded border border-input px-4 py-2 font-medium hover:bg-accent"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit for Verification'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <div className="rounded-lg bg-emerald-50 p-6 text-center">
            <div className="text-5xl">✓</div>
            <h2 className="mt-4 text-2xl font-bold text-emerald-900">Verification Submitted</h2>
            <p className="mt-2 text-emerald-700">
              Your KYC information has been submitted. We typically complete verification within 24
              hours.
            </p>
            <p className="mt-4 text-sm text-emerald-600">
              You'll receive an email notification once verification is complete.
            </p>
            <button
              onClick={onComplete}
              className="mt-6 rounded bg-emerald-600 px-6 py-2 font-medium text-white hover:bg-emerald-700"
            >
              Done
            </button>
          </div>
        )}

        {/* Error Step */}
        {step === 'error' && (
          <div className="rounded-lg bg-destructive/10 p-6 text-center">
            <div className="text-5xl">⚠</div>
            <h2 className="mt-4 text-2xl font-bold text-destructive">Verification Failed</h2>
            <p className="mt-2 text-destructive/80">{error}</p>
            <button
              onClick={() => {
                setStep('form');
                setError('');
              }}
              className="mt-6 rounded bg-destructive px-6 py-2 font-medium text-white hover:bg-destructive/90"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default KYCGuide;
