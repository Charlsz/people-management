import styles from './Styles/MainLayout.module.css';

interface StatusIndicatorProps {
  active: boolean;
  label?: string;
}

export default function StatusIndicator({ active, label = "Estado" }: StatusIndicatorProps) {
  return (
    <div className={styles.statusContainer}>
      <span className={styles.statusLabel}>{label}</span>
      <div className={`${styles.statusDot} ${active ? styles.statusActive : styles.statusInactive}`}></div>
    </div>
  );
}
