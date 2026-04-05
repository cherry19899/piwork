/**
 * Date formatting utilities
 */

export const formatDate = (date, format = 'short') => {
  const d = new Date(date);

  switch (format) {
    case 'short':
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    case 'long':
      return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    case 'time':
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    case 'full':
      return d.toLocaleString('en-US');
    default:
      return d.toISOString();
  }
};

export const formatRelativeTime = (date) => {
  const d = new Date(date);
  const now = new Date();
  const seconds = Math.floor((now - d) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return formatDate(d, 'short');
};

export const getTimeRemaining = (deadline) => {
  const d = new Date(deadline);
  const now = new Date();
  const ms = d - now;

  if (ms < 0) return 'Expired';
  if (ms < 3600000) return `${Math.floor(ms / 60000)}m`;
  if (ms < 86400000) return `${Math.floor(ms / 3600000)}h`;

  return `${Math.floor(ms / 86400000)}d`;
};
