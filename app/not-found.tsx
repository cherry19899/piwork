'use client';

import { useRouter } from 'next/navigation';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';

export default function NotFound() {
  const router = useRouter();
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', backgroundColor: PIWORK_THEME.colors.bgPrimary,
      color: PIWORK_THEME.colors.textPrimary, padding: PIWORK_THEME.spacing.lg, textAlign: 'center',
    }}>
      <div style={{ fontSize: 64, marginBottom: PIWORK_THEME.spacing.md }}>🔍</div>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, marginBottom: PIWORK_THEME.spacing.sm }}>
        Страница не найдена
      </h1>
      <p style={{ fontSize: 14, color: PIWORK_THEME.colors.textSecondary, margin: 0, marginBottom: PIWORK_THEME.spacing.xl }}>
        Такой страницы не существует или она была удалена
      </p>
      <button
        onClick={() => router.replace('/feed')}
        style={{
          padding: '12px 32px', backgroundColor: PIWORK_THEME.colors.primary,
          border: 'none', borderRadius: PIWORK_THEME.radius.lg,
          color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
        }}
      >
        На главную
      </button>
    </div>
  );
}
