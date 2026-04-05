import { Link } from 'react-router-dom';
import styles from './TaskCard.module.css';

export default function TaskCard({ task }) {
  if (!task) return null;

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Link to={`/task/${task.id}`} className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatar}>{task.creatorAvatar || '👤'}</div>
        <div className={styles.info}>
          <h3>{task.title}</h3>
          <p className={styles.creator}>{task.creatorName || 'Anonymous'}</p>
        </div>
      </div>

      <p className={styles.description}>{task.description}</p>

      <div className={styles.footer}>
        <div className={styles.budget}>
          <span className={styles.amount}>{task.budget}π</span>
          <span className={styles.deadline}>{formatDate(task.deadline)}</span>
        </div>
      </div>
    </Link>
  );
}
