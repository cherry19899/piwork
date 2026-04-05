'use client';

import React, { ReactNode, useState, useId } from 'react';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';

interface AccessibleInputProps {
  type?: 'text' | 'number' | 'email' | 'password' | 'tel';
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  autoComplete?: string;
}

export function AccessibleInput({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  ariaLabel,
  ariaDescribedBy,
  autoComplete,
}: AccessibleInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = useId();
  const errorId = useId();
  const labelId = useId();

  return (
    <div style={{ marginBottom: PIWORK_THEME.spacing.md }}>
      {label && (
        <label
          htmlFor={inputId}
          id={labelId}
          style={{
            display: 'block',
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 8,
            color: PIWORK_THEME.colors.textPrimary,
          }}
        >
          {label}
          {required && (
            <span
              style={{
                color: '#EF4444',
                marginLeft: 4,
              }}
              aria-label="required"
            >
              *
            </span>
          )}
        </label>
      )}

      <input
        id={inputId}
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        aria-label={ariaLabel || label}
        aria-describedby={error ? errorId : ariaDescribedBy}
        aria-invalid={!!error}
        aria-required={required}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          width: '100%',
          height: 48,
          padding: `${PIWORK_THEME.spacing.md}px`,
          backgroundColor: PIWORK_THEME.colors.bgPrimary,
          border: `2px solid ${error ? '#EF4444' : isFocused ? PIWORK_THEME.colors.primary : PIWORK_THEME.colors.border}`,
          borderRadius: PIWORK_THEME.radius.lg,
          color: PIWORK_THEME.colors.textPrimary,
          fontSize: 14,
          outline: 'none',
          transition: 'border-color 200ms ease',
          boxSizing: 'border-box',
          WebkitAppearance: 'none',
        }}
      />

      {error && (
        <p
          id={errorId}
          style={{
            fontSize: 12,
            color: '#EF4444',
            marginTop: 6,
            margin: 0,
          }}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

interface AccessibleTextareaProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  ariaLabel?: string;
}

export function AccessibleTextarea({
  label,
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  rows = 4,
  ariaLabel,
}: AccessibleTextareaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaId = useId();
  const errorId = useId();

  return (
    <div style={{ marginBottom: PIWORK_THEME.spacing.md }}>
      {label && (
        <label
          htmlFor={textareaId}
          style={{
            display: 'block',
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 8,
            color: PIWORK_THEME.colors.textPrimary,
          }}
        >
          {label}
          {required && (
            <span
              style={{
                color: '#EF4444',
                marginLeft: 4,
              }}
              aria-label="required"
            >
              *
            </span>
          )}
        </label>
      )}

      <textarea
        id={textareaId}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        aria-label={ariaLabel || label}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={!!error}
        aria-required={required}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          width: '100%',
          padding: `${PIWORK_THEME.spacing.md}px`,
          backgroundColor: PIWORK_THEME.colors.bgPrimary,
          border: `2px solid ${error ? '#EF4444' : isFocused ? PIWORK_THEME.colors.primary : PIWORK_THEME.colors.border}`,
          borderRadius: PIWORK_THEME.radius.lg,
          color: PIWORK_THEME.colors.textPrimary,
          fontSize: 14,
          fontFamily: 'inherit',
          outline: 'none',
          transition: 'border-color 200ms ease',
          boxSizing: 'border-box',
          WebkitAppearance: 'none',
          resize: 'vertical',
        }}
      />

      {error && (
        <p
          id={errorId}
          style={{
            fontSize: 12,
            color: '#EF4444',
            marginTop: 6,
            margin: 0,
          }}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

interface AccessibleSelectProps {
  label?: string;
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  ariaLabel?: string;
}

export function AccessibleSelect({
  label,
  options,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  ariaLabel,
}: AccessibleSelectProps) {
  const [isFocused, setIsFocused] = useState(false);
  const selectId = useId();
  const errorId = useId();

  return (
    <div style={{ marginBottom: PIWORK_THEME.spacing.md }}>
      {label && (
        <label
          htmlFor={selectId}
          style={{
            display: 'block',
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 8,
            color: PIWORK_THEME.colors.textPrimary,
          }}
        >
          {label}
          {required && (
            <span
              style={{
                color: '#EF4444',
                marginLeft: 4,
              }}
              aria-label="required"
            >
              *
            </span>
          )}
        </label>
      )}

      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        required={required}
        aria-label={ariaLabel || label}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={!!error}
        aria-required={required}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          width: '100%',
          height: 48,
          padding: `${PIWORK_THEME.spacing.md}px`,
          backgroundColor: PIWORK_THEME.colors.bgPrimary,
          border: `2px solid ${error ? '#EF4444' : isFocused ? PIWORK_THEME.colors.primary : PIWORK_THEME.colors.border}`,
          borderRadius: PIWORK_THEME.radius.lg,
          color: PIWORK_THEME.colors.textPrimary,
          fontSize: 14,
          outline: 'none',
          transition: 'border-color 200ms ease',
          boxSizing: 'border-box',
          WebkitAppearance: 'none',
          cursor: 'pointer',
        }}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p
          id={errorId}
          style={{
            fontSize: 12,
            color: '#EF4444',
            marginTop: 6,
            margin: 0,
          }}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
