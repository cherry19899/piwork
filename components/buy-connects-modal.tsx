'use client';

import { useState } from 'react';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import { PiPaymentService } from '@/lib/pi-sdk-service';
import { buyConnectsPackage } from '@/lib/workpro-api';

const PACKAGES = [
  { connects: 10, pi: 1, label: 'Старт', description: '~10 откликов на задачи', popular: false },
  { connects: 30, pi: 2.5, label: 'Популярный', description: '~30 откликов на задачи', popular: true },
  { connects: 100, pi: 7, label: 'Профи', description: '~100 откликов на задачи', popular: false },
] as const;

interface BuyConnectsModalProps {
  currentBalance: number;
  onClose: () => void;
  onSuccess: (added: number) => void;
}

export function BuyConnectsModal({ currentBalance, onClose, onSuccess }: BuyConnectsModalProps) {
  const [buying, setBuying] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successAdded, setSuccessAdded] = useState<number | null>(null);

  const handleBuy = async (pkg: typeof PACKAGES[number]) => {
    setBuying(pkg.connects);
    setError(null);
    try {
      const payment = await PiPaymentService.createPayment({
        amount: pkg.pi,
        memo: `${pkg.connects} Connects - PiWork`,
        metadata: { type: 'connects', connects_amount: pkg.connects },
      });
      if (payment?.identifier) {
        await buyConnectsPackage(pkg.pi, pkg.connects, payment.identifier);
        setSuccessAdded(pkg.connects);
        setTimeout(() => {
          onSuccess(pkg.connects);
          onClose();
        }, 1500);
      }
    } catch (e: any) {
      setError(e.message || 'Ошибка платежа. Попробуйте ещё раз.');
    } finally {
      setBuying(null);
    }
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        backgroundColor: PIWORK_THEME.colors.overlay,
        display: 'flex', alignItems: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          backgroundColor: PIWORK_THEME.colors.bgSecondary,
          borderRadius: `${PIWORK_THEME.radius.xl}px ${PIWORK_THEME.radius.xl}px 0 0`,
          padding: PIWORK_THEME.spacing.lg,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: PIWORK_THEME.spacing.md }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: PIWORK_THEME.colors.textPrimary }}>
            Купить Connects
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', color: PIWORK_THEME.colors.textSecondary,
              fontSize: 28, cursor: 'pointer', padding: '0 4px', lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <p style={{ fontSize: 13, color: PIWORK_THEME.colors.textSecondary, marginBottom: PIWORK_THEME.spacing.lg, marginTop: 0 }}>
          Текущий баланс:{' '}
          <strong style={{ color: PIWORK_THEME.colors.primary }}>{currentBalance} connects</strong>
        </p>

        {successAdded !== null && (
          <div style={{
            backgroundColor: '#22C55E20', border: '1px solid #22C55E40',
            borderRadius: PIWORK_THEME.radius.md, padding: PIWORK_THEME.spacing.md,
            marginBottom: PIWORK_THEME.spacing.md, textAlign: 'center',
            color: '#22C55E', fontWeight: 600, fontSize: 15,
          }}>
            ✓ +{successAdded} connects зачислены!
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: '#EF444420', border: '1px solid #EF444440',
            borderRadius: PIWORK_THEME.radius.md, padding: PIWORK_THEME.spacing.md,
            marginBottom: PIWORK_THEME.spacing.md, color: '#EF4444', fontSize: 13,
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: PIWORK_THEME.spacing.md }}>
          {PACKAGES.map((pkg) => (
            <button
              key={pkg.connects}
              onClick={() => handleBuy(pkg)}
              disabled={buying !== null || successAdded !== null}
              style={{
                position: 'relative',
                backgroundColor: PIWORK_THEME.colors.bgPrimary,
                border: `2px solid ${pkg.popular ? PIWORK_THEME.colors.primary : PIWORK_THEME.colors.border}`,
                borderRadius: PIWORK_THEME.radius.lg,
                padding: `${PIWORK_THEME.spacing.md}px`,
                cursor: (buying !== null || successAdded !== null) ? 'not-allowed' : 'pointer',
                opacity: buying !== null && buying !== pkg.connects ? 0.5 : 1,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                textAlign: 'left', width: '100%',
                transition: 'opacity 150ms',
              }}
            >
              {pkg.popular && (
                <span style={{
                  position: 'absolute', top: -10, left: 16,
                  backgroundColor: PIWORK_THEME.colors.primary,
                  color: '#fff', fontSize: 10, fontWeight: 700,
                  padding: '2px 8px', borderRadius: PIWORK_THEME.radius.full,
                }}>
                  ПОПУЛЯРНЫЙ
                </span>
              )}
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: PIWORK_THEME.colors.textPrimary }}>
                  {pkg.connects} connects
                </div>
                <div style={{ fontSize: 12, color: PIWORK_THEME.colors.textSecondary, marginTop: 3 }}>
                  {pkg.description}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: PIWORK_THEME.colors.primary }}>
                  {buying === pkg.connects ? '...' : `${pkg.pi}π`}
                </div>
                <div style={{ fontSize: 11, color: PIWORK_THEME.colors.textTertiary }}>
                  {(pkg.pi / pkg.connects).toFixed(2)}π / 1
                </div>
              </div>
            </button>
          ))}
        </div>

        <p style={{
          fontSize: 11, color: PIWORK_THEME.colors.textTertiary,
          marginTop: PIWORK_THEME.spacing.md, marginBottom: 0, textAlign: 'center',
        }}>
          1 connect списывается при каждом отклике на задачу
        </p>
      </div>
    </div>
  );
}
