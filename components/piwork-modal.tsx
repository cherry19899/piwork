'use client';

import React from 'react';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import { PiworkButton } from './piwork-button';

interface PiworkModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'dual' | 'single';
  loading?: boolean;
}

export function PiworkModal({
  isOpen,
  title,
  children,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'dual',
  loading = false,
}: PiworkModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        animation: 'fadeIn 200ms ease-out',
      }}
      onClick={onCancel}
    >
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>

      <div
        style={{
          backgroundColor: '#1A1A1A',
          borderRadius: 16,
          maxWidth: 360,
          width: '90%',
          padding: PIWORK_THEME.spacing.lg,
          animation: 'scaleIn 200ms ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            textAlign: 'center',
            margin: 0,
            marginBottom: PIWORK_THEME.spacing.lg,
            color: PIWORK_THEME.colors.textPrimary,
          }}
        >
          {title}
        </h2>

        {/* Content */}
        <div
          style={{
            fontSize: 14,
            textAlign: 'center',
            marginBottom: PIWORK_THEME.spacing.lg,
            color: PIWORK_THEME.colors.textSecondary,
            lineHeight: 1.6,
          }}
        >
          {children}
        </div>

        {/* Buttons */}
        <div
          style={{
            display: 'flex',
            gap: PIWORK_THEME.spacing.md,
            flexDirection: variant === 'single' ? 'column' : 'row',
          }}
        >
          {variant === 'dual' && (
            <button
              onClick={onCancel}
              disabled={loading}
              style={{
                flex: 1,
                height: 48,
                backgroundColor: 'transparent',
                border: `2px solid ${PIWORK_THEME.colors.primary}`,
                color: PIWORK_THEME.colors.primary,
                borderRadius: PIWORK_THEME.radius.lg,
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 200ms ease',
                textTransform: 'uppercase',
                opacity: loading ? 0.5 : 1,
              }}
            >
              {cancelText}
            </button>
          )}

          <div style={{ flex: 1 }}>
            <PiworkButton
              variant="primary"
              fullWidth={true}
              onClick={onConfirm}
              disabled={loading}
              isLoading={loading}
            >
              {confirmText}
            </PiworkButton>
          </div>
        </div>
      </div>
    </div>
  );
}
