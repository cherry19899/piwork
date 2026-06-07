'use client';

import { useState } from 'react';
import { PiworkButton } from '@/components/piwork-button';
import { PiPaymentService } from '@/lib/pi-sdk-service';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import { loginUser, handleIncompletePayment } from '@/lib/workpro-api';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePiConnect = async () => {
    setIsLoading(true);
    setError(null);
    try {
      PiPaymentService.initializePi();
      const piUser = await PiPaymentService.authenticateUser();
      if (!piUser) throw new Error('Ошибка аутентификации Pi');

      const { user, token } = await loginUser(piUser.uid, piUser.username);

      localStorage.setItem('piUser', JSON.stringify({ ...piUser, ...user }));
      if (token) localStorage.setItem('authToken', token);

      // Check for incomplete Pi payments from previous session
      if (typeof window !== 'undefined' && (window as any).Pi) {
        try {
          const Pi = (window as any).Pi;
          if (Pi.openPayment) {
            Pi.openPayment({ onReadyForServerCompletion: async (paymentId: string, txid: string) => {
              await handleIncompletePayment(paymentId).catch(() => {});
            }});
          }
        } catch (_) {}
      }

      // Show onboarding to first-time users
      const isNewUser = user?.created_at && (Date.now() - new Date(user.created_at).getTime() < 60000);
      const onboardingDone = localStorage.getItem('onboarding_done');
      if (isNewUser && !onboardingDone) {
        window.location.href = '/onboarding';
      } else {
        window.location.href = '/feed';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка подключения к Pi Network');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', backgroundColor: PIWORK_THEME.colors.bgPrimary,
      color: PIWORK_THEME.colors.textPrimary, padding: PIWORK_THEME.spacing.lg,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 64 }}>
        <div style={{ fontSize: 64, marginBottom: PIWORK_THEME.spacing.md }}>π</div>
        <h1 style={{ fontSize: PIWORK_THEME.typography.h1.fontSize, fontWeight: 700, margin: 0, marginBottom: PIWORK_THEME.spacing.sm, textAlign: 'center' }}>
          PiWork
        </h1>
        <p style={{ fontSize: PIWORK_THEME.typography.small.fontSize, color: PIWORK_THEME.colors.textSecondary, margin: 0, textAlign: 'center' }}>
          Зарабатывайте Pi своими навыками
        </p>
      </div>

      <div style={{ width: '100%', maxWidth: 400, marginBottom: 24 }}>
        <div style={{ height: 56 }}>
          <PiworkButton variant="primary" isLoading={isLoading} disabled={isLoading} onClick={handlePiConnect} fullWidth>
            Войти через Pi
          </PiworkButton>
        </div>
      </div>

      {error && (
        <div style={{
          width: '100%', maxWidth: 400, backgroundColor: '#EF4444',
          color: '#fff', padding: PIWORK_THEME.spacing.md,
          borderRadius: PIWORK_THEME.radius.lg, marginBottom: PIWORK_THEME.spacing.md,
          fontSize: PIWORK_THEME.typography.small.fontSize,
        }}>
          {error}
        </div>
      )}

      <p style={{ fontSize: 12, color: PIWORK_THEME.colors.textSecondary, textAlign: 'center', margin: 0, maxWidth: 400, lineHeight: 1.6 }}>
        Требуется Pi Browser и KYC верификация
      </p>

      <div style={{
        marginTop: 64, maxWidth: 400, width: '100%',
        padding: PIWORK_THEME.spacing.md, backgroundColor: PIWORK_THEME.colors.bgSecondary,
        borderRadius: PIWORK_THEME.radius.lg, border: `1px solid ${PIWORK_THEME.colors.border}`,
      }}>
        <h3 style={{ fontSize: PIWORK_THEME.typography.body.fontSize, fontWeight: 600, margin: 0, marginBottom: PIWORK_THEME.spacing.sm }}>
          Как это работает
        </h3>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: PIWORK_THEME.typography.small.fontSize, color: PIWORK_THEME.colors.textSecondary, lineHeight: 1.8 }}>
          <li>Скачайте приложение Pi Network</li>
          <li>Пройдите KYC верификацию</li>
          <li>Подключитесь к PiWork</li>
          <li>Начните зарабатывать Pi</li>
        </ul>
      </div>
    </div>
  );
}
