'use client';

import { useState } from 'react';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import { BottomNavigation } from '@/components/bottom-navigation';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <div style={{ marginBottom: PIWORK_THEME.spacing.lg }}>
      <h3
        style={{
          fontSize: PIWORK_THEME.typography.small.fontSize,
          fontWeight: 700,
          color: PIWORK_THEME.colors.textSecondary,
          margin: 0,
          marginBottom: PIWORK_THEME.spacing.md,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

interface SettingItemProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  divider?: boolean;
}

function SettingItem({ label, description, children, divider = true }: SettingItemProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: `${PIWORK_THEME.spacing.md}px 0`,
        borderBottom: divider ? `1px solid ${PIWORK_THEME.colors.border}` : 'none',
      }}
    >
      <div>
        <div
          style={{
            fontSize: PIWORK_THEME.typography.body.fontSize,
            fontWeight: 500,
            color: PIWORK_THEME.colors.textPrimary,
            marginBottom: description ? 4 : 0,
          }}
        >
          {label}
        </div>
        {description && (
          <div
            style={{
              fontSize: PIWORK_THEME.typography.small.fontSize,
              color: PIWORK_THEME.colors.textSecondary,
            }}
          >
            {description}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      aria-label={checked ? 'Enabled' : 'Disabled'}
      style={{
        width: 48,
        height: 28,
        borderRadius: 14,
        backgroundColor: checked ? PIWORK_THEME.colors.primary : PIWORK_THEME.colors.border,
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        padding: 2,
        transition: 'background-color 200ms ease',
      }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          transition: 'transform 200ms ease',
          transform: checked ? 'translateX(20px)' : 'translateX(0)',
        }}
      />
    </button>
  );
}

function SelectInput({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: `${PIWORK_THEME.spacing.sm}px ${PIWORK_THEME.spacing.md}px`,
        backgroundColor: PIWORK_THEME.colors.bgSecondary,
        border: `1px solid ${PIWORK_THEME.colors.border}`,
        borderRadius: PIWORK_THEME.radius.md,
        color: PIWORK_THEME.colors.textPrimary,
        fontSize: PIWORK_THEME.typography.body.fontSize,
        cursor: 'pointer',
        minWidth: 120,
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export default function SettingsPage() {
  const [language, setLanguage] = useState('ru');
  const [country, setCountry] = useState('rus');
  const [currencyDisplay, setCurrencyDisplay] = useState('pi');
  const [newTasksNotif, setNewTasksNotif] = useState(true);
  const [messagesNotif, setMessagesNotif] = useState(true);
  const [taskUpdatesNotif, setTaskUpdatesNotif] = useState(true);
  const [promotionsNotif, setPromotionsNotif] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [appVersion] = useState('1.0.0');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: PIWORK_THEME.colors.bgPrimary,
        color: PIWORK_THEME.colors.textPrimary,
        paddingBottom: 80,
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: PIWORK_THEME.colors.bgSecondary,
          borderBottom: `1px solid ${PIWORK_THEME.colors.border}`,
          padding: `${PIWORK_THEME.spacing.md}px`,
          display: 'flex',
          alignItems: 'center',
          gap: PIWORK_THEME.spacing.md,
          animation: 'slideInRight 300ms ease-out',
        }}
      >
        <button
          onClick={() => window.history.back()}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: PIWORK_THEME.colors.primary,
            fontSize: 24,
            cursor: 'pointer',
            padding: 0,
          }}
          aria-label="Go back"
        >
          ←
        </button>
        <h1
          style={{
            fontSize: PIWORK_THEME.typography.h1.fontSize,
            fontWeight: 700,
            margin: 0,
          }}
        >
          Settings
        </h1>
      </header>

      {/* Content */}
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: PIWORK_THEME.spacing.lg,
          maxWidth: 600,
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Account Section */}
        <SettingsSection title="Account">
          <SettingItem label="Language" description="Choose your preferred language">
            <SelectInput
              value={language}
              onChange={setLanguage}
              options={[
                { label: 'Русский', value: 'ru' },
                { label: 'English', value: 'en' },
                { label: '中文', value: 'zh' },
                { label: 'Español', value: 'es' },
                { label: 'हिन्दी', value: 'hi' },
              ]}
            />
          </SettingItem>

          <SettingItem label="Country" description="Select for accurate pricing">
            <SelectInput
              value={country}
              onChange={setCountry}
              options={[
                { label: 'Russia', value: 'rus' },
                { label: 'India', value: 'ind' },
                { label: 'United States', value: 'usa' },
                { label: 'China', value: 'chn' },
                { label: 'Brazil', value: 'bra' },
              ]}
            />
          </SettingItem>

          <SettingItem label="Currency Display" divider={false}>
            <SelectInput
              value={currencyDisplay}
              onChange={setCurrencyDisplay}
              options={[
                { label: 'Pi Only', value: 'pi' },
                { label: 'USD Equivalent', value: 'usd' },
                { label: 'Both', value: 'both' },
              ]}
            />
          </SettingItem>
        </SettingsSection>

        {/* Notifications Section */}
        <SettingsSection title="Notifications">
          <SettingItem label="New Tasks" description="Get notified about new available tasks">
            <ToggleSwitch checked={newTasksNotif} onChange={setNewTasksNotif} />
          </SettingItem>

          <SettingItem label="Messages" description="Chat and direct messages">
            <ToggleSwitch checked={messagesNotif} onChange={setMessagesNotif} />
          </SettingItem>

          <SettingItem label="Task Updates" description="Status changes and progress">
            <ToggleSwitch checked={taskUpdatesNotif} onChange={setTaskUpdatesNotif} />
          </SettingItem>

          <SettingItem label="Promotions" description="Special offers and news" divider={false}>
            <ToggleSwitch checked={promotionsNotif} onChange={setPromotionsNotif} />
          </SettingItem>
        </SettingsSection>

        {/* Security Section */}
        <SettingsSection title="Security">
          <SettingItem label="Change PIN" description="Update your 4-digit PIN">
            <button
              style={{
                padding: `${PIWORK_THEME.spacing.sm}px ${PIWORK_THEME.spacing.md}px`,
                backgroundColor: PIWORK_THEME.colors.primary,
                color: '#FFFFFF',
                border: 'none',
                borderRadius: PIWORK_THEME.radius.md,
                fontSize: PIWORK_THEME.typography.small.fontSize,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 200ms ease',
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)';
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
              }}
            >
              Change
            </button>
          </SettingItem>

          <SettingItem
            label="Biometric Login"
            description="Use fingerprint or face recognition"
            divider={false}
          >
            <ToggleSwitch checked={biometricEnabled} onChange={setBiometricEnabled} />
          </SettingItem>
        </SettingsSection>

        {/* About Section */}
        <SettingsSection title="About">
          <SettingItem label="Version" divider={true}>
            <div style={{ color: PIWORK_THEME.colors.textSecondary }}>v{appVersion}</div>
          </SettingItem>

          <SettingItem label="Terms of Service" divider={true}>
            <button
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: PIWORK_THEME.colors.primary,
                cursor: 'pointer',
                fontSize: PIWORK_THEME.typography.body.fontSize,
                fontWeight: 500,
                padding: 0,
                textDecoration: 'underline',
              }}
            >
              Read
            </button>
          </SettingItem>

          <SettingItem label="Privacy Policy" divider={true}>
            <button
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: PIWORK_THEME.colors.primary,
                cursor: 'pointer',
                fontSize: PIWORK_THEME.typography.body.fontSize,
                fontWeight: 500,
                padding: 0,
                textDecoration: 'underline',
              }}
            >
              Read
            </button>
          </SettingItem>

          <SettingItem label="Delete Account" divider={false}>
            <button
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: PIWORK_THEME.colors.error,
                cursor: 'pointer',
                fontSize: PIWORK_THEME.typography.body.fontSize,
                fontWeight: 600,
                padding: 0,
              }}
              role="button"
              aria-label="Delete account permanently"
            >
              Delete
            </button>
          </SettingItem>
        </SettingsSection>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
