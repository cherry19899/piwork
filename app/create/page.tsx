'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import { BottomNavigation } from '@/components/bottom-navigation';
import { PiworkButton } from '@/components/piwork-button';
import { createJob } from '@/lib/workpro-api';

const steps = ['Детали', 'Бюджет', 'Подтверждение'];
const categoryOptions = ['Design', 'Writing', 'Data', 'Audio', 'Video', 'Other'];
const CATEGORY_RU: Record<string, string> = {
  Design: 'Дизайн', Writing: 'Тексты', Data: 'Данные',
  Audio: 'Аудио', Video: 'Видео', Other: 'Другое',
};

export default function CreateTaskPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    try {
      const uid = JSON.parse(localStorage.getItem('piUser') || 'null')?.uid;
      if (!uid) router.replace('/login');
    } catch { router.replace('/login'); }
  }, [router]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Design',
    skills: '',
    budget: '',
    deadline: '',
  });

  const update = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const validateStep = () => {
    if (currentStep === 1) {
      if (!formData.title.trim()) return 'Введите название задачи';
      if (formData.title.length < 5) return 'Название должно быть не менее 5 символов';
      if (!formData.description.trim()) return 'Введите описание';
      if (formData.description.length < 20) return 'Описание должно быть не менее 20 символов';
    }
    if (currentStep === 2) {
      if (!formData.budget) return 'Укажите бюджет';
      if (parseFloat(formData.budget) < 1) return 'Минимальный бюджет — 1π';
    }
    return null;
  };

  const handleNext = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError(null);
    setCurrentStep((s) => Math.min(s + 1, 3));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const userId = JSON.parse(localStorage.getItem('piUser') || '{}')?.uid;
      if (!userId) throw new Error('Войдите в систему');

      const result = await createJob({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        budget: parseFloat(formData.budget),
        skills: formData.skills.trim() || undefined,
        deadline: formData.deadline || undefined,
      });

      const jobId = (result as any)?.job?.id;
      router.push(jobId ? `/task/${jobId}` : '/feed');
    } catch (e: any) {
      setError(e.message || 'Ошибка при создании задачи');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%', backgroundColor: PIWORK_THEME.colors.bgPrimary,
    border: `1px solid ${PIWORK_THEME.colors.border}`,
    borderRadius: PIWORK_THEME.radius.md, padding: PIWORK_THEME.spacing.md,
    color: PIWORK_THEME.colors.textPrimary, fontSize: 14,
    boxSizing: 'border-box' as const, outline: 'none',
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', minHeight: '100vh',
      backgroundColor: PIWORK_THEME.colors.bgPrimary, color: PIWORK_THEME.colors.textPrimary, paddingBottom: 100,
    }}>
      <header style={{
        backgroundColor: PIWORK_THEME.colors.bgSecondary,
        borderBottom: `1px solid ${PIWORK_THEME.colors.border}`,
        padding: `${PIWORK_THEME.spacing.md}px`,
        paddingBottom: PIWORK_THEME.spacing.lg,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: PIWORK_THEME.spacing.md }}>
          <button onClick={() => currentStep > 1 ? setCurrentStep(s => s - 1) : router.back()} style={{
            backgroundColor: 'transparent', border: 'none',
            color: PIWORK_THEME.colors.primary, fontSize: 24, cursor: 'pointer', padding: 0,
            marginRight: PIWORK_THEME.spacing.md,
          }}>←</button>
          <h1 style={{ fontSize: PIWORK_THEME.typography.h2.fontSize, fontWeight: 700, margin: 0 }}>
            Создать задачу
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: PIWORK_THEME.spacing.sm }}>
          {steps.map((step, index) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                backgroundColor: index + 1 <= currentStep ? PIWORK_THEME.colors.primary : PIWORK_THEME.colors.bgPrimary,
                border: `2px solid ${index + 1 <= currentStep ? PIWORK_THEME.colors.primary : PIWORK_THEME.colors.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700,
                color: index + 1 <= currentStep ? '#fff' : PIWORK_THEME.colors.textSecondary,
              }}>
                {index + 1 < currentStep ? '✓' : index + 1}
              </div>
              <span style={{
                fontSize: 12, marginLeft: 6,
                color: index + 1 === currentStep ? PIWORK_THEME.colors.textPrimary : PIWORK_THEME.colors.textSecondary,
                fontWeight: index + 1 === currentStep ? 600 : 400,
              }}>
                {step}
              </span>
              {index < steps.length - 1 && (
                <div style={{
                  flex: 1, height: 2, marginLeft: 8,
                  backgroundColor: index + 1 < currentStep ? PIWORK_THEME.colors.primary : PIWORK_THEME.colors.border,
                }} />
              )}
            </div>
          ))}
        </div>
      </header>

      <main style={{ flex: 1, padding: PIWORK_THEME.spacing.lg, overflowY: 'auto' }}>
        {error && (
          <div style={{
            backgroundColor: '#EF444420', border: '1px solid #EF4444',
            borderRadius: PIWORK_THEME.radius.md, padding: PIWORK_THEME.spacing.md,
            color: '#EF4444', fontSize: 14, marginBottom: PIWORK_THEME.spacing.md,
          }}>
            {error}
          </div>
        )}

        {currentStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: PIWORK_THEME.spacing.lg }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: PIWORK_THEME.colors.textSecondary, display: 'block', marginBottom: 8 }}>
                Название задачи *
              </label>
              <input type="text" value={formData.title} onChange={(e) => update('title', e.target.value)}
                placeholder="Например: Нужен дизайн логотипа" style={inputStyle} maxLength={100} />
              <span style={{ fontSize: 11, color: formData.title.length > 0 && formData.title.length < 5 ? '#EF4444' : PIWORK_THEME.colors.textSecondary }}>
                {formData.title.length > 0 && formData.title.length < 5 ? `Минимум 5 символов (${formData.title.length}/5)` : `${formData.title.length}/100`}
              </span>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: PIWORK_THEME.colors.textSecondary, display: 'block', marginBottom: 8 }}>
                Описание *
              </label>
              <textarea value={formData.description} onChange={(e) => update('description', e.target.value)}
                placeholder="Подробно опишите что нужно сделать..." rows={5}
                maxLength={5000}
                style={{ ...inputStyle, resize: 'vertical' }} />
              <span style={{ fontSize: 11, color: formData.description.length > 4800 ? '#F59E0B' : PIWORK_THEME.colors.textSecondary }}>
                {formData.description.length}/5000
              </span>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: PIWORK_THEME.colors.textSecondary, display: 'block', marginBottom: 8 }}>
                Категория
              </label>
              <select value={formData.category} onChange={(e) => update('category', e.target.value)} style={inputStyle}>
                {categoryOptions.map((c) => <option key={c} value={c}>{CATEGORY_RU[c] || c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: PIWORK_THEME.colors.textSecondary, display: 'block', marginBottom: 8 }}>
                Навыки (через запятую)
              </label>
              <input type="text" value={formData.skills} onChange={(e) => update('skills', e.target.value)}
                placeholder="Figma, Illustrator, Photoshop" style={inputStyle} maxLength={300} />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: PIWORK_THEME.spacing.lg }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: PIWORK_THEME.colors.textSecondary, display: 'block', marginBottom: 8 }}>
                Бюджет (в Pi) *
              </label>
              <div style={{ position: 'relative' }}>
                <input type="number" value={formData.budget} onChange={(e) => update('budget', e.target.value)}
                  placeholder="0" min="1" step="0.5" style={{ ...inputStyle, paddingRight: 40 }} />
                <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: PIWORK_THEME.colors.primary, fontWeight: 700, fontSize: 18 }}>π</span>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: PIWORK_THEME.colors.textSecondary, display: 'block', marginBottom: 8 }}>
                Быстрый выбор
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {[10, 25, 50, 100, 250, 500].map((amount) => (
                  <button key={amount} onClick={() => update('budget', String(amount))} style={{
                    padding: '8px 16px',
                    backgroundColor: formData.budget === String(amount) ? PIWORK_THEME.colors.primary : PIWORK_THEME.colors.bgSecondary,
                    color: formData.budget === String(amount) ? '#fff' : PIWORK_THEME.colors.textPrimary,
                    border: `1px solid ${formData.budget === String(amount) ? PIWORK_THEME.colors.primary : PIWORK_THEME.colors.border}`,
                    borderRadius: PIWORK_THEME.radius.md, cursor: 'pointer', fontSize: 14, fontWeight: 600,
                  }}>
                    {amount}π
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: PIWORK_THEME.colors.textSecondary, display: 'block', marginBottom: 8 }}>
                Дедлайн (необязательно)
              </label>
              <input type="date" value={formData.deadline} onChange={(e) => update('deadline', e.target.value)}
                min={new Date().toISOString().split('T')[0]} style={inputStyle} />
            </div>
            {formData.budget && (
              <div style={{ backgroundColor: PIWORK_THEME.colors.bgSecondary, border: `1px solid ${PIWORK_THEME.colors.border}`, borderRadius: PIWORK_THEME.radius.lg, padding: PIWORK_THEME.spacing.md }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: PIWORK_THEME.colors.textSecondary, fontSize: 14 }}>Сумма</span>
                  <span style={{ fontWeight: 600 }}>{formData.budget}π</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: PIWORK_THEME.colors.textSecondary, fontSize: 14 }}>Комиссия (2%)</span>
                  <span style={{ color: PIWORK_THEME.colors.textSecondary }}>{(parseFloat(formData.budget) * 0.02).toFixed(2)}π</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: PIWORK_THEME.colors.textSecondary, fontSize: 14 }}>Стоимость отклика</span>
                  <span style={{ fontWeight: 600, color: PIWORK_THEME.colors.primary }}>{Math.ceil(parseFloat(formData.budget) / 50)} коннект</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${PIWORK_THEME.colors.border}`, paddingTop: 8 }}>
                  <span style={{ fontWeight: 700 }}>Фрилансер получит</span>
                  <span style={{ fontWeight: 700, color: PIWORK_THEME.colors.primary }}>{(parseFloat(formData.budget) * 0.98).toFixed(2)}π</span>
                </div>
              </div>
            )}
            <div style={{ backgroundColor: '#7C3AED15', border: '1px solid #7C3AED40', borderRadius: PIWORK_THEME.radius.md, padding: PIWORK_THEME.spacing.md }}>
              <p style={{ margin: 0, fontSize: 12, color: PIWORK_THEME.colors.textSecondary, lineHeight: 1.6 }}>
                💡 <strong>Стоимость отклика</strong> — сколько коннектов спишется у фрилансера при отклике:<br/>
                1–50π = 1 коннект · 51–100π = 2 · 101–150π = 3 и т.д.
              </p>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: PIWORK_THEME.spacing.md }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, marginBottom: PIWORK_THEME.spacing.md }}>Проверьте данные</h2>
            {[
              { label: 'Название', value: formData.title },
              { label: 'Категория', value: CATEGORY_RU[formData.category] || formData.category },
              { label: 'Бюджет', value: `${formData.budget}π` },
              { label: 'Стоимость отклика', value: `${Math.ceil(parseFloat(formData.budget || '1') / 50)} коннект` },
              { label: 'Навыки', value: formData.skills || '—' },
              { label: 'Дедлайн', value: formData.deadline || '—' },
            ].map(({ label, value }) => (
              <div key={label} style={{
                backgroundColor: PIWORK_THEME.colors.bgSecondary, border: `1px solid ${PIWORK_THEME.colors.border}`,
                borderRadius: PIWORK_THEME.radius.md, padding: PIWORK_THEME.spacing.md,
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              }}>
                <span style={{ fontSize: 13, color: PIWORK_THEME.colors.textSecondary }}>{label}</span>
                <span style={{ fontSize: 14, fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{value}</span>
              </div>
            ))}
            <div style={{ backgroundColor: PIWORK_THEME.colors.bgSecondary, border: `1px solid ${PIWORK_THEME.colors.border}`, borderRadius: PIWORK_THEME.radius.md, padding: PIWORK_THEME.spacing.md }}>
              <span style={{ fontSize: 13, color: PIWORK_THEME.colors.textSecondary, display: 'block', marginBottom: 8 }}>Описание</span>
              <p style={{ fontSize: 14, margin: 0, lineHeight: 1.6 }}>{formData.description}</p>
            </div>
          </div>
        )}
      </main>

      <div style={{
        position: 'fixed', bottom: 80, left: PIWORK_THEME.spacing.md, right: PIWORK_THEME.spacing.md,
        backgroundColor: PIWORK_THEME.colors.bgPrimary,
        borderTop: `1px solid ${PIWORK_THEME.colors.border}`,
        paddingTop: PIWORK_THEME.spacing.md,
      }}>
        {currentStep === 3 ? (
          <PiworkButton variant="primary" fullWidth onClick={handleSubmit} isLoading={isSubmitting} disabled={isSubmitting}>
            {isSubmitting ? 'Публикуем...' : 'Опубликовать задачу'}
          </PiworkButton>
        ) : (
          <PiworkButton variant="primary" fullWidth onClick={handleNext}>
            Далее →
          </PiworkButton>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}
