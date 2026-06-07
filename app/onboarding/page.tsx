'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import { AccessibleButton } from '@/components/ui/accessible-button';

type OnboardingStep = 1 | 2 | 3 | 4;

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);

  const finish = () => {
    localStorage.setItem('onboarding_done', 'true');
    router.push('/feed');
  };

  const handleSkip = () => finish();
  const handleNext = () => {
    if (currentStep < 4) setCurrentStep((currentStep + 1) as OnboardingStep);
    else finish();
  };
  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep((currentStep - 1) as OnboardingStep);
  };

  const containerStyles: React.CSSProperties = {
    display: 'flex', flexDirection: 'column', minHeight: '100vh',
    backgroundColor: PIWORK_THEME.colors.bgPrimary, color: PIWORK_THEME.colors.textPrimary,
    padding: PIWORK_THEME.spacing.lg, justifyContent: 'space-between', position: 'relative',
  };

  const contentStyles: React.CSSProperties = {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', flex: 1, textAlign: 'center', gap: PIWORK_THEME.spacing.xl,
  };

  const skipButtonStyles: React.CSSProperties = {
    position: 'absolute', top: PIWORK_THEME.spacing.md, right: PIWORK_THEME.spacing.md,
    fontSize: 14, fontWeight: 600, backgroundColor: 'transparent', border: 'none',
    color: PIWORK_THEME.colors.primary, cursor: 'pointer', padding: 8,
  };

  const dotStyles = (isActive: boolean): React.CSSProperties => ({
    width: 12, height: 12, borderRadius: '50%',
    backgroundColor: isActive ? PIWORK_THEME.colors.primary : PIWORK_THEME.colors.border,
    cursor: 'pointer', transition: 'all 200ms ease',
  });

  const steps = [
    {
      icon: '💼',
      title: 'Зарабатывай Pi своими навыками',
      text: 'Выполняй задачи от клиентов со всего мира и зарабатывай Pi. Без банков и границ.',
    },
    {
      icon: '🛡️',
      title: 'Безопасные платежи',
      text: 'Средства блокируются в эскроу до завершения работы. Твой труд всегда защищён.',
    },
    {
      icon: '🌍',
      title: 'Глобальное сообщество',
      text: 'Тысячи клиентов и исполнителей по всему миру. Работай без ограничений.',
    },
    {
      icon: 'π',
      title: 'Привязать Pi кошелёк',
      text: 'Привяжи кошелёк Pi Network, чтобы начать получать выплаты за выполненные задачи.',
    },
  ];

  const step = steps[currentStep - 1];

  return (
    <div style={containerStyles}>
      <button onClick={handleSkip} style={skipButtonStyles}>
        Пропустить
      </button>

      <main style={contentStyles}>
        <div style={{ animation: 'fadeIn 300ms ease-out' }}>
          <div style={{ fontSize: 80, marginBottom: PIWORK_THEME.spacing.lg }}>{step.icon}</div>
          <h1 style={{ fontSize: 30, fontWeight: 700, margin: 0, marginBottom: PIWORK_THEME.spacing.md, lineHeight: 1.2 }}>
            {step.title}
          </h1>
          <p style={{ fontSize: 16, color: PIWORK_THEME.colors.textSecondary, maxWidth: 300, lineHeight: 1.6, margin: 0 }}>
            {step.text}
          </p>
        </div>
      </main>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: PIWORK_THEME.spacing.xl }}>
        {[1, 2, 3, 4].map((s) => (
          <button key={s} onClick={() => setCurrentStep(s as OnboardingStep)} style={dotStyles(currentStep === s)} />
        ))}
      </div>

      <div style={{ display: 'flex', gap: PIWORK_THEME.spacing.md, width: '100%', maxWidth: 400 }}>
        {currentStep > 1 && (
          <AccessibleButton variant="secondary" fullWidth onClick={handlePrevious} ariaLabel="Назад">
            Назад
          </AccessibleButton>
        )}
        {currentStep < 4 ? (
          <AccessibleButton variant="primary" fullWidth={currentStep === 1} onClick={handleNext} ariaLabel="Далее">
            Далее
          </AccessibleButton>
        ) : (
          <AccessibleButton variant="primary" fullWidth onClick={finish} ariaLabel="Начать">
            Начать
          </AccessibleButton>
        )}
      </div>
    </div>
  );
}
