'use client';

import { useState } from 'react';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import { submitRating } from '@/lib/workpro-api';

interface RatingModalProps {
  toUserId: string;
  toUserName: string;
  jobId: number;
  onClose: () => void;
  onSubmitted?: () => void;
}

export function RatingModal({ toUserId, toUserName, jobId, onClose, onSubmitted }: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    try {
      await submitRating(toUserId, jobId, rating, comment);
      setDone(true);
      setTimeout(() => {
        onSubmitted?.();
        onClose();
      }, 1200);
    } catch (_) {
      onSubmitted?.();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const starLabels = ['', 'Плохо', 'Ниже среднего', 'Нормально', 'Хорошо', 'Отлично'];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      backgroundColor: PIWORK_THEME.colors.overlay,
      display: 'flex', alignItems: 'flex-end',
    }}>
      <div style={{
        width: '100%',
        backgroundColor: PIWORK_THEME.colors.bgSecondary,
        borderRadius: `${PIWORK_THEME.radius.xl}px ${PIWORK_THEME.radius.xl}px 0 0`,
        padding: PIWORK_THEME.spacing.lg,
        paddingBottom: 32,
      }}>
        {done ? (
          <div style={{ textAlign: 'center', padding: `${PIWORK_THEME.spacing.xl}px 0` }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>⭐</div>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#22C55E', margin: 0 }}>Отзыв отправлен!</p>
            <p style={{ fontSize: 13, color: PIWORK_THEME.colors.textSecondary, marginTop: 6 }}>
              Спасибо за оценку
            </p>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, marginBottom: 6, color: PIWORK_THEME.colors.textPrimary }}>
              Оцените работу
            </h2>
            <p style={{ fontSize: 13, color: PIWORK_THEME.colors.textSecondary, marginBottom: PIWORK_THEME.spacing.lg }}>
              {toUserName} — ваш отзыв поможет другим пользователям
            </p>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 8 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 44, padding: 4, lineHeight: 1,
                    color: star <= (hovered || rating) ? '#F59E0B' : PIWORK_THEME.colors.border,
                    transition: 'color 100ms',
                  }}
                >
                  ★
                </button>
              ))}
            </div>

            {(hovered || rating) > 0 && (
              <p style={{
                textAlign: 'center', fontSize: 13, fontWeight: 600,
                color: PIWORK_THEME.colors.warning, marginBottom: PIWORK_THEME.spacing.md,
                minHeight: 20,
              }}>
                {starLabels[hovered || rating]}
              </p>
            )}

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Напишите отзыв... (необязательно)"
              rows={3}
              style={{
                width: '100%', backgroundColor: PIWORK_THEME.colors.bgPrimary,
                border: `1px solid ${PIWORK_THEME.colors.border}`,
                borderRadius: PIWORK_THEME.radius.md, padding: PIWORK_THEME.spacing.md,
                color: PIWORK_THEME.colors.textPrimary, fontSize: 14, resize: 'none',
                boxSizing: 'border-box', outline: 'none',
                marginBottom: PIWORK_THEME.spacing.md,
              }}
            />

            <div style={{ display: 'flex', gap: PIWORK_THEME.spacing.md }}>
              <button
                onClick={onClose}
                style={{
                  flex: 1, padding: PIWORK_THEME.spacing.md,
                  backgroundColor: 'transparent',
                  border: `1px solid ${PIWORK_THEME.colors.border}`,
                  borderRadius: PIWORK_THEME.radius.md,
                  color: PIWORK_THEME.colors.textSecondary,
                  cursor: 'pointer', fontSize: 14,
                }}
              >
                Пропустить
              </button>
              <button
                onClick={handleSubmit}
                disabled={rating === 0 || submitting}
                style={{
                  flex: 2, padding: PIWORK_THEME.spacing.md,
                  backgroundColor: rating === 0 ? PIWORK_THEME.colors.disabled : PIWORK_THEME.colors.primary,
                  border: 'none', borderRadius: PIWORK_THEME.radius.md,
                  color: '#fff', cursor: rating === 0 ? 'not-allowed' : 'pointer',
                  fontSize: 14, fontWeight: 600,
                }}
              >
                {submitting ? 'Отправляем...' : 'Отправить отзыв'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
