import styles from './Timer.module.css'

function Timer({ time }) {
  return (
    <div className={styles.timer} aria-label={`Time remaining: ${time}`}>
      <span className={styles.icon} aria-hidden="true">◷</span>
      <span>{time}</span>
    </div>
  )
}

export default Timer
