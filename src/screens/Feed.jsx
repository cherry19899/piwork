import { useEffect, useState, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import PullToRefresh from 'react-pull-to-refresh';
import { useTasks } from '../hooks/useTasks';
import TaskCard from './TaskCard';
import styles from './Feed.module.css';

export default function Feed() {
  const { tasks, loading, subscribe } = useTasks();
  const [displayTasks, setDisplayTasks] = useState([]);
  const listRef = useRef(null);

  useEffect(() => {
    // Subscribe to open tasks only
    const unsubscribe = subscribe((allTasks) => {
      const filtered = allTasks.filter((task) => task.status === 'open');
      setDisplayTasks(filtered);
    });

    return () => unsubscribe?.();
  }, [subscribe]);

  const handleRefresh = async () => {
    // Trigger a new subscription to refresh data
    const unsubscribe = subscribe((allTasks) => {
      const filtered = allTasks.filter((task) => task.status === 'open');
      setDisplayTasks(filtered);
    });
    return new Promise((resolve) => {
      setTimeout(() => {
        unsubscribe?.();
        resolve();
      }, 1000);
    });
  };

  const Row = ({ index, style }) => (
    <div style={style} className={styles.rowWrapper}>
      <TaskCard task={displayTasks[index]} />
    </div>
  );

  if (loading && displayTasks.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.skeleton} />
          <div className={styles.skeleton} />
          <div className={styles.skeleton} />
        </div>
      </div>
    );
  }

  if (displayTasks.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <p>No open tasks available</p>
          <p className={styles.emptySubtext}>Check back later for new opportunities</p>
        </div>
      </div>
    );
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className={styles.container}>
        <h2>Available Tasks</h2>
        <List
          ref={listRef}
          height={600}
          itemCount={displayTasks.length}
          itemSize={220}
          width="100%"
        >
          {Row}
        </List>
      </div>
    </PullToRefresh>
  );
}
