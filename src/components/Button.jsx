import { useState } from 'react';
import styles from './Button.module.css';

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  children,
  className = '',
}) {
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    if (disabled || loading) return;

    // Ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, size, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);

    onClick?.();
  };

  const buttonClasses = `
    ${styles.button}
    ${styles[variant]}
    ${styles[size]}
    ${disabled ? styles.disabled : ''}
    ${loading ? styles.loading : ''}
    ${className}
  `;

  return (
    <button
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-busy={loading}
    >
      <div className={styles.rippleContainer}>
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className={styles.ripple}
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
            }}
          />
        ))}
      </div>

      <div className={styles.content}>
        {loading && <span className={styles.spinner} />}
        {!loading && children}
      </div>
    </button>
  );
}
