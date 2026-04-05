'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import { BottomNavigation } from '@/components/bottom-navigation';
import { PiworkButton } from '@/components/piwork-button';

const steps = ['Details', 'Budget', 'Confirm'];

export default function CreateTaskPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'design',
    budget: '',
    deadline: '7',
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 3) {
      // Submit task
      router.push('/feed');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: PIWORK_THEME.colors.bgPrimary,
        color: PIWORK_THEME.colors.textPrimary,
        paddingBottom: 100,
      }}
    >
      {/* Header with Progress */}
      <header
        style={{
          backgroundColor: PIWORK_THEME.colors.bgSecondary,
          borderBottom: `1px solid ${PIWORK_THEME.colors.border}`,
          padding: `${PIWORK_THEME.spacing.md}px`,
          paddingBottom: PIWORK_THEME.spacing.lg,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: PIWORK_THEME.spacing.md }}>
          <button
            onClick={() => router.back()}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: PIWORK_THEME.colors.primary,
              fontSize: 24,
              cursor: 'pointer',
              padding: 0,
              marginRight: PIWORK_THEME.spacing.md,
            }}
          >
            ←
          </button>
          <h1
            style={{
              fontSize: PIWORK_THEME.typography.h2.fontSize,
              fontWeight: 700,
              margin: 0,
            }}
          >
            Создать задачу
          </h1>
        </div>

        {/* Progress Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: PIWORK_THEME.spacing.md }}>
          {steps.map((step, index) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor:
                    index + 1 <= currentStep ? PIWORK_THEME.colors.primary : PIWORK_THEME.colors.bgPrimary,
                  border:
                    index + 1 <= currentStep
                      ? 'none'
                      : `2px solid ${PIWORK_THEME.colors.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: index + 1 <= currentStep ? PIWORK_THEME.colors.bgPrimary : PIWORK_THEME.colors.textSecondary,
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {index + 1}
              </div>
              <span
                style={{
                  fontSize: PIWORK_THEME.typography.small.fontSize,
                  color:
                    index + 1 <= currentStep
                      ? PIWORK_THEME.colors.primary
                      : PIWORK_THEME.colors.textSecondary,
                  marginLeft: 8,
                  fontWeight: 600,
                }}
              >
                {step}
              </span>
              {index < steps.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    backgroundColor:
                      index + 1 < currentStep ? PIWORK_THEME.colors.primary : PIWORK_THEME.colors.border,
                    margin: `0 ${PIWORK_THEME.spacing.sm}px`,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          padding: PIWORK_THEME.spacing.lg,
          overflowY: 'auto',
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Step 1: Details */}
          {currentStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: PIWORK_THEME.spacing.lg }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14 }}>
                  Название задачи
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Что нужно сделать?"
                  style={{
                    width: '100%',
                    height: 56,
                    padding: `${PIWORK_THEME.spacing.md}px`,
                    backgroundColor: PIWORK_THEME.colors.bgSecondary,
                    border: `1px solid ${PIWORK_THEME.colors.border}`,
                    borderRadius: PIWORK_THEME.radius.lg,
                    color: PIWORK_THEME.colors.textPrimary,
                    fontSize: PIWORK_THEME.typography.body.fontSize,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14 }}>
                  Описание
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Подробно опиши что нужно сделать..."
                  style={{
                    width: '100%',
                    height: 120,
                    padding: `${PIWORK_THEME.spacing.md}px`,
                    backgroundColor: PIWORK_THEME.colors.bgSecondary,
                    border: `1px solid ${PIWORK_THEME.colors.border}`,
                    borderRadius: PIWORK_THEME.radius.lg,
                    color: PIWORK_THEME.colors.textPrimary,
                    fontSize: PIWORK_THEME.typography.body.fontSize,
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    resize: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14 }}>
                  Категория
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{
                    width: '100%',
                    height: 48,
                    padding: `${PIWORK_THEME.spacing.md}px`,
                    backgroundColor: PIWORK_THEME.colors.bgSecondary,
                    border: `1px solid ${PIWORK_THEME.colors.border}`,
                    borderRadius: PIWORK_THEME.radius.lg,
                    color: PIWORK_THEME.colors.textPrimary,
                    fontSize: PIWORK_THEME.typography.body.fontSize,
                  }}
                >
                  <option value="design">Дизайн</option>
                  <option value="writing">Писательство</option>
                  <option value="data">Ввод данных</option>
                  <option value="audio">Транскрипция</option>
                  <option value="video">Видео</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Budget */}
          {currentStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: PIWORK_THEME.spacing.lg }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14 }}>
                  Бюджет
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: PIWORK_THEME.colors.bgSecondary,
                    border: `1px solid ${PIWORK_THEME.colors.border}`,
                    borderRadius: PIWORK_THEME.radius.lg,
                    paddingRight: PIWORK_THEME.spacing.md,
                  }}
                >
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="50"
                    style={{
                      flex: 1,
                      padding: `${PIWORK_THEME.spacing.md}px`,
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: PIWORK_THEME.colors.textPrimary,
                      fontSize: PIWORK_THEME.typography.body.fontSize,
                      outline: 'none',
                    }}
                  />
                  <span style={{ fontWeight: 700, fontSize: 18, color: PIWORK_THEME.colors.primary }}>
                    π
                  </span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14 }}>
                  Срок выполнения
                </label>
                <select
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  style={{
                    width: '100%',
                    height: 48,
                    padding: `${PIWORK_THEME.spacing.md}px`,
                    backgroundColor: PIWORK_THEME.colors.bgSecondary,
                    border: `1px solid ${PIWORK_THEME.colors.border}`,
                    borderRadius: PIWORK_THEME.radius.lg,
                    color: PIWORK_THEME.colors.textPrimary,
                    fontSize: PIWORK_THEME.typography.body.fontSize,
                  }}
                >
                  <option value="1">1 день</option>
                  <option value="3">3 дня</option>
                  <option value="7">7 дней</option>
                  <option value="14">14 дней</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {currentStep === 3 && (
            <div
              style={{
                backgroundColor: PIWORK_THEME.colors.bgSecondary,
                border: `1px solid ${PIWORK_THEME.colors.border}`,
                borderRadius: PIWORK_THEME.radius.lg,
                padding: PIWORK_THEME.spacing.lg,
              }}
            >
              <h2
                style={{
                  fontSize: PIWORK_THEME.typography.h2.fontSize,
                  fontWeight: 600,
                  margin: 0,
                  marginBottom: PIWORK_THEME.spacing.lg,
                }}
              >
                Проверь информацию
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: PIWORK_THEME.spacing.lg }}>
                <div>
                  <p
                    style={{
                      fontSize: PIWORK_THEME.typography.small.fontSize,
                      color: PIWORK_THEME.colors.textSecondary,
                      margin: 0,
                      marginBottom: 4,
                    }}
                  >
                    Название
                  </p>
                  <p style={{ fontSize: PIWORK_THEME.typography.body.fontSize, fontWeight: 600, margin: 0 }}>
                    {formData.title || 'Не указано'}
                  </p>
                </div>

                <div>
                  <p
                    style={{
                      fontSize: PIWORK_THEME.typography.small.fontSize,
                      color: PIWORK_THEME.colors.textSecondary,
                      margin: 0,
                      marginBottom: 4,
                    }}
                  >
                    Описание
                  </p>
                  <p style={{ fontSize: PIWORK_THEME.typography.body.fontSize, margin: 0 }}>
                    {formData.description || 'Не указано'}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: PIWORK_THEME.spacing.lg }}>
                  <div>
                    <p
                      style={{
                        fontSize: PIWORK_THEME.typography.small.fontSize,
                        color: PIWORK_THEME.colors.textSecondary,
                        margin: 0,
                        marginBottom: 4,
                      }}
                    >
                      Бюджет
                    </p>
                    <p
                      style={{
                        fontSize: PIWORK_THEME.typography.h2.fontSize,
                        fontWeight: 700,
                        color: PIWORK_THEME.colors.primary,
                        margin: 0,
                      }}
                    >
                      {formData.budget}π
                    </p>
                  </div>

                  <div>
                    <p
                      style={{
                        fontSize: PIWORK_THEME.typography.small.fontSize,
                        color: PIWORK_THEME.colors.textSecondary,
                        margin: 0,
                        marginBottom: 4,
                      }}
                    >
                      Срок
                    </p>
                    <p style={{ fontSize: PIWORK_THEME.typography.body.fontSize, fontWeight: 600, margin: 0 }}>
                      {formData.deadline} дней
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </main>

      {/* Fixed Bottom Buttons */}
      <div
        style={{
          position: 'fixed',
          bottom: 80,
          left: PIWORK_THEME.spacing.md,
          right: PIWORK_THEME.spacing.md,
          backgroundColor: PIWORK_THEME.colors.bgPrimary,
          display: 'flex',
          gap: PIWORK_THEME.spacing.md,
          paddingTop: PIWORK_THEME.spacing.md,
          borderTop: `1px solid ${PIWORK_THEME.colors.border}`,
        }}
      >
        {currentStep > 1 && (
          <button
            onClick={handlePrevious}
            style={{
              flex: 1,
              height: 48,
              backgroundColor: 'transparent',
              border: `2px solid ${PIWORK_THEME.colors.primary}`,
              color: PIWORK_THEME.colors.primary,
              borderRadius: PIWORK_THEME.radius.lg,
              fontSize: PIWORK_THEME.typography.body.fontSize,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 200ms ease',
              textTransform: 'uppercase',
            }}
          >
            Назад
          </button>
        )}

        <div style={{ flex: 1 }}>
          <PiworkButton
            variant="primary"
            fullWidth={true}
            onClick={currentStep < 3 ? handleNext : handleSubmit}
          >
            {currentStep < 3 ? 'Далее' : 'Опубликовать'}
          </PiworkButton>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
