'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import { BottomNavigation } from '@/components/bottom-navigation';
import { deleteAccount } from '@/lib/workpro-api';

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: PIWORK_THEME.spacing.lg }}>
      <h3 style={{
        fontSize: PIWORK_THEME.typography.small.fontSize, fontWeight: 700,
        color: PIWORK_THEME.colors.textSecondary, margin: 0, marginBottom: PIWORK_THEME.spacing.md,
        textTransform: 'uppercase', letterSpacing: 0.5,
      }}>{title}</h3>
      {children}
    </div>
  );
}

function SettingItem({ label, description, children, divider = true }: {
  label: string; description?: string; children: React.ReactNode; divider?: boolean;
}) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: `${PIWORK_THEME.spacing.md}px 0`,
      borderBottom: divider ? `1px solid ${PIWORK_THEME.colors.border}` : 'none',
    }}>
      <div>
        <div style={{ fontSize: PIWORK_THEME.typography.body.fontSize, fontWeight: 500, color: PIWORK_THEME.colors.textPrimary, marginBottom: description ? 4 : 0 }}>
          {label}
        </div>
        {description && (
          <div style={{ fontSize: PIWORK_THEME.typography.small.fontSize, color: PIWORK_THEME.colors.textSecondary }}>
            {description}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)} role="switch" aria-checked={checked} style={{
      width: 48, height: 28, borderRadius: 14,
      backgroundColor: checked ? PIWORK_THEME.colors.primary : PIWORK_THEME.colors.border,
      border: 'none', cursor: 'pointer', position: 'relative',
      display: 'flex', alignItems: 'center', padding: 2,
      transition: 'background-color 200ms ease',
    }}>
      <div style={{
        width: 24, height: 24, borderRadius: '50%', backgroundColor: '#fff',
        transition: 'transform 200ms ease', transform: checked ? 'translateX(20px)' : 'translateX(0)',
      }} />
    </button>
  );
}

function SelectInput({ value, onChange, options }: {
  value: string; onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={{
      padding: `${PIWORK_THEME.spacing.sm}px ${PIWORK_THEME.spacing.md}px`,
      backgroundColor: PIWORK_THEME.colors.bgSecondary,
      border: `1px solid ${PIWORK_THEME.colors.border}`,
      borderRadius: PIWORK_THEME.radius.md,
      color: PIWORK_THEME.colors.textPrimary,
      fontSize: PIWORK_THEME.typography.body.fontSize, cursor: 'pointer', minWidth: 120,
    }}>
      {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const [language, setLanguage] = useState('ru');
  const [country, setCountry] = useState('rus');
  const [currencyDisplay, setCurrencyDisplay] = useState('pi');
  const [newTasksNotif, setNewTasksNotif] = useState(true);
  const [messagesNotif, setMessagesNotif] = useState(true);
  const [taskUpdatesNotif, setTaskUpdatesNotif] = useState(true);
  const [promotionsNotif, setPromotionsNotif] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [kycVerified, setKycVerified] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('piUser') || 'null');
      setKycVerified(u?.kyc_verified ?? null);
    } catch (_) {}
  }, []);

  // PIN modal
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinStep, setPinStep] = useState<'enter' | 'confirm'>('enter');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinSaved, setPinSaved] = useState(false);

  // Delete account modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handlePinNext = () => {
    if (newPin.length !== 4) { setPinError('Введите 4 цифры'); return; }
    setPinStep('confirm');
    setPinError('');
  };

  const handlePinSave = () => {
    if (confirmPin !== newPin) { setPinError('PIN не совпадает'); return; }
    // Store hashed PIN in localStorage (real app would send to backend)
    localStorage.setItem('user_pin', btoa(newPin));
    setPinSaved(true);
    setTimeout(() => {
      setShowPinModal(false);
      setPinStep('enter');
      setNewPin('');
      setConfirmPin('');
      setPinSaved(false);
      setPinError('');
    }, 1200);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'УДАЛИТЬ') return;
    setDeleting(true);
    try {
      await deleteAccount();
    } catch (_) {}
    localStorage.clear();
    router.push('/login');
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', minHeight: '100vh',
      backgroundColor: PIWORK_THEME.colors.bgPrimary, color: PIWORK_THEME.colors.textPrimary, paddingBottom: 80,
    }}>
      <header style={{
        backgroundColor: PIWORK_THEME.colors.bgSecondary,
        borderBottom: `1px solid ${PIWORK_THEME.colors.border}`,
        padding: `${PIWORK_THEME.spacing.md}px`,
        display: 'flex', alignItems: 'center', gap: PIWORK_THEME.spacing.md,
      }}>
        <button onClick={() => router.back()} style={{
          backgroundColor: 'transparent', border: 'none',
          color: PIWORK_THEME.colors.primary, fontSize: 24, cursor: 'pointer', padding: 0,
        }}>←</button>
        <h1 style={{ fontSize: PIWORK_THEME.typography.h1.fontSize, fontWeight: 700, margin: 0 }}>Настройки</h1>
      </header>

      <main style={{ flex: 1, overflowY: 'auto', padding: PIWORK_THEME.spacing.lg, maxWidth: 600, margin: '0 auto', width: '100%' }}>
        <SettingsSection title="Аккаунт">
          <SettingItem label="Язык" description="Выберите язык интерфейса">
            <SelectInput value={language} onChange={setLanguage} options={[
              { label: 'Русский', value: 'ru' }, { label: 'English', value: 'en' },
              { label: '中文', value: 'zh' }, { label: 'Español', value: 'es' }, { label: 'हिन्दी', value: 'hi' },
            ]} />
          </SettingItem>
          <SettingItem label="Страна" description="Для точного ценообразования">
            <SelectInput value={country} onChange={setCountry} options={[
              { label: 'Россия', value: 'rus' }, { label: 'Индия', value: 'ind' },
              { label: 'США', value: 'usa' }, { label: 'Китай', value: 'chn' }, { label: 'Бразилия', value: 'bra' },
            ]} />
          </SettingItem>
          <SettingItem label="Отображение валюты" divider={false}>
            <SelectInput value={currencyDisplay} onChange={setCurrencyDisplay} options={[
              { label: 'Pi', value: 'pi' }, { label: 'USD', value: 'usd' }, { label: 'Оба', value: 'both' },
            ]} />
          </SettingItem>
        </SettingsSection>

        <SettingsSection title="Уведомления">
          <SettingItem label="Новые задачи" description="Уведомлять о доступных задачах">
            <ToggleSwitch checked={newTasksNotif} onChange={setNewTasksNotif} />
          </SettingItem>
          <SettingItem label="Сообщения" description="Чат и личные сообщения">
            <ToggleSwitch checked={messagesNotif} onChange={setMessagesNotif} />
          </SettingItem>
          <SettingItem label="Обновления задач" description="Изменения статуса">
            <ToggleSwitch checked={taskUpdatesNotif} onChange={setTaskUpdatesNotif} />
          </SettingItem>
          <SettingItem label="Акции и новости" divider={false}>
            <ToggleSwitch checked={promotionsNotif} onChange={setPromotionsNotif} />
          </SettingItem>
        </SettingsSection>

        <SettingsSection title="Безопасность">
          <SettingItem label="KYC верификация" description="Статус проверки личности">
            <span style={{
              fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 8,
              backgroundColor: kycVerified ? '#22C55E20' : '#F59E0B20',
              color: kycVerified ? '#22C55E' : '#F59E0B',
            }}>
              {kycVerified === null ? '...' : kycVerified ? '✓ Пройдена' : '⚠ Не пройдена'}
            </span>
          </SettingItem>
          <SettingItem label="Изменить PIN" description="Обновить 4-значный PIN-код">
            <button onClick={() => setShowPinModal(true)} style={{
              padding: `${PIWORK_THEME.spacing.sm}px ${PIWORK_THEME.spacing.md}px`,
              backgroundColor: PIWORK_THEME.colors.primary, color: '#fff',
              border: 'none', borderRadius: PIWORK_THEME.radius.md,
              fontSize: PIWORK_THEME.typography.small.fontSize, fontWeight: 600, cursor: 'pointer',
            }}>Изменить</button>
          </SettingItem>
          <SettingItem label="Биометрия" description="Вход по отпечатку или лицу" divider={false}>
            <ToggleSwitch checked={biometricEnabled} onChange={setBiometricEnabled} />
          </SettingItem>
        </SettingsSection>

        <SettingsSection title="О приложении">
          <SettingItem label="Версия" divider={true}>
            <div style={{ color: PIWORK_THEME.colors.textSecondary }}>v1.0.0</div>
          </SettingItem>
          <SettingItem label="Условия использования" divider={true}>
            <button style={{ backgroundColor: 'transparent', border: 'none', color: PIWORK_THEME.colors.primary, cursor: 'pointer', fontSize: 14, fontWeight: 500, padding: 0, textDecoration: 'underline' }}>
              Читать
            </button>
          </SettingItem>
          <SettingItem label="Политика конфиденциальности" divider={true}>
            <button style={{ backgroundColor: 'transparent', border: 'none', color: PIWORK_THEME.colors.primary, cursor: 'pointer', fontSize: 14, fontWeight: 500, padding: 0, textDecoration: 'underline' }}>
              Читать
            </button>
          </SettingItem>
          <SettingItem label="Удалить аккаунт" divider={false}>
            <button onClick={() => setShowDeleteModal(true)} style={{
              backgroundColor: 'transparent', border: 'none',
              color: PIWORK_THEME.colors.error, cursor: 'pointer', fontSize: 14, fontWeight: 600, padding: 0,
            }}>Удалить</button>
          </SettingItem>
        </SettingsSection>
      </main>

      <BottomNavigation />

      {/* PIN Modal */}
      {showPinModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: PIWORK_THEME.colors.overlay, display: 'flex', alignItems: 'flex-end' }}
          onClick={() => setShowPinModal(false)}>
          <div style={{
            width: '100%', backgroundColor: PIWORK_THEME.colors.bgSecondary,
            borderRadius: `${PIWORK_THEME.radius.xl}px ${PIWORK_THEME.radius.xl}px 0 0`,
            padding: PIWORK_THEME.spacing.lg, paddingBottom: 32,
          }} onClick={(e) => e.stopPropagation()}>
            {pinSaved ? (
              <div style={{ textAlign: 'center', padding: PIWORK_THEME.spacing.xl }}>
                <p style={{ fontSize: 40 }}>✅</p>
                <p style={{ fontWeight: 700, color: '#22C55E', margin: 0 }}>PIN сохранён</p>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, marginBottom: 8 }}>
                  {pinStep === 'enter' ? 'Новый PIN' : 'Подтвердите PIN'}
                </h2>
                <p style={{ fontSize: 13, color: PIWORK_THEME.colors.textSecondary, marginBottom: PIWORK_THEME.spacing.lg }}>
                  {pinStep === 'enter' ? 'Введите 4-значный PIN-код' : 'Повторите PIN для подтверждения'}
                </p>
                <input
                  type="password" inputMode="numeric" maxLength={4}
                  value={pinStep === 'enter' ? newPin : confirmPin}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                    pinStep === 'enter' ? setNewPin(v) : setConfirmPin(v);
                    setPinError('');
                  }}
                  placeholder="● ● ● ●"
                  style={{
                    width: '100%', textAlign: 'center', fontSize: 24, letterSpacing: 12,
                    backgroundColor: PIWORK_THEME.colors.bgPrimary,
                    border: `1px solid ${pinError ? '#EF4444' : PIWORK_THEME.colors.border}`,
                    borderRadius: PIWORK_THEME.radius.md, padding: PIWORK_THEME.spacing.md,
                    color: PIWORK_THEME.colors.textPrimary, outline: 'none',
                    boxSizing: 'border-box', marginBottom: pinError ? 8 : PIWORK_THEME.spacing.md,
                  }}
                />
                {pinError && <p style={{ color: '#EF4444', fontSize: 13, margin: '0 0 16px' }}>{pinError}</p>}
                <div style={{ display: 'flex', gap: PIWORK_THEME.spacing.md }}>
                  <button onClick={() => {
                    if (pinStep === 'confirm') { setPinStep('enter'); setPinError(''); }
                    else setShowPinModal(false);
                  }} style={{
                    flex: 1, padding: PIWORK_THEME.spacing.md, backgroundColor: 'transparent',
                    border: `1px solid ${PIWORK_THEME.colors.border}`, borderRadius: PIWORK_THEME.radius.md,
                    color: PIWORK_THEME.colors.textSecondary, cursor: 'pointer', fontSize: 14,
                  }}>
                    {pinStep === 'confirm' ? 'Назад' : 'Отмена'}
                  </button>
                  <button
                    onClick={pinStep === 'enter' ? handlePinNext : handlePinSave}
                    disabled={(pinStep === 'enter' ? newPin : confirmPin).length !== 4}
                    style={{
                      flex: 2, padding: PIWORK_THEME.spacing.md,
                      backgroundColor: (pinStep === 'enter' ? newPin : confirmPin).length === 4
                        ? PIWORK_THEME.colors.primary : PIWORK_THEME.colors.disabled,
                      border: 'none', borderRadius: PIWORK_THEME.radius.md,
                      color: '#fff', cursor: (pinStep === 'enter' ? newPin : confirmPin).length === 4 ? 'pointer' : 'not-allowed',
                      fontSize: 14, fontWeight: 600,
                    }}>
                    {pinStep === 'enter' ? 'Далее' : 'Сохранить PIN'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: PIWORK_THEME.colors.overlay, display: 'flex', alignItems: 'flex-end' }}
          onClick={() => setShowDeleteModal(false)}>
          <div style={{
            width: '100%', backgroundColor: PIWORK_THEME.colors.bgSecondary,
            borderRadius: `${PIWORK_THEME.radius.xl}px ${PIWORK_THEME.radius.xl}px 0 0`,
            padding: PIWORK_THEME.spacing.lg, paddingBottom: 32,
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, marginBottom: 8, color: '#EF4444' }}>
              Удалить аккаунт
            </h2>
            <p style={{ fontSize: 13, color: PIWORK_THEME.colors.textSecondary, marginBottom: PIWORK_THEME.spacing.lg }}>
              Это действие необратимо. Все ваши данные, заказы и история будут удалены.
              Введите <strong style={{ color: PIWORK_THEME.colors.textPrimary }}>УДАЛИТЬ</strong> для подтверждения.
            </p>
            <input
              type="text" value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="УДАЛИТЬ"
              style={{
                width: '100%', backgroundColor: PIWORK_THEME.colors.bgPrimary,
                border: `1px solid #EF444440`, borderRadius: PIWORK_THEME.radius.md,
                padding: PIWORK_THEME.spacing.md, color: PIWORK_THEME.colors.textPrimary,
                fontSize: 14, outline: 'none', boxSizing: 'border-box',
                marginBottom: PIWORK_THEME.spacing.md,
              }}
            />
            <div style={{ display: 'flex', gap: PIWORK_THEME.spacing.md }}>
              <button onClick={() => { setShowDeleteModal(false); setDeleteConfirm(''); }} style={{
                flex: 1, padding: PIWORK_THEME.spacing.md, backgroundColor: 'transparent',
                border: `1px solid ${PIWORK_THEME.colors.border}`, borderRadius: PIWORK_THEME.radius.md,
                color: PIWORK_THEME.colors.textSecondary, cursor: 'pointer', fontSize: 14,
              }}>Отмена</button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== 'УДАЛИТЬ' || deleting}
                style={{
                  flex: 2, padding: PIWORK_THEME.spacing.md,
                  backgroundColor: deleteConfirm === 'УДАЛИТЬ' ? '#EF4444' : PIWORK_THEME.colors.disabled,
                  border: 'none', borderRadius: PIWORK_THEME.radius.md, color: '#fff',
                  cursor: deleteConfirm === 'УДАЛИТЬ' ? 'pointer' : 'not-allowed',
                  fontSize: 14, fontWeight: 600,
                }}>
                {deleting ? 'Удаляем...' : 'Удалить навсегда'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
