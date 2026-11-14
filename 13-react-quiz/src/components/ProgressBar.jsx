import styles from './ProgressBar.module.css'

function ProgressBar({ current, total }) {
  const progress = total > 0 ? (current / total) * 100 : 0

  return (
    <div className={styles.progress}>
      <div className={styles.labels}>
        <span>YOUR PROGRESS</span>
        <span>{current} <span className={styles.divider}>/</span> {total}</span>
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-label="Quiz progress"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current}
      >
        <span className={styles.fill} style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

export default ProgressBar
