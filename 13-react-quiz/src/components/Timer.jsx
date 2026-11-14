import styles from './Timer.module.css'

function Timer({ secondsRemaining }) {
  const minutes = Math.floor(secondsRemaining / 60)
  const seconds = secondsRemaining % 60
  const time = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  return (
    <div className={styles.timer} role="timer" aria-label={`Time remaining: ${time}`}>
      <span className={styles.icon} aria-hidden="true">◷</span>
      <span>{time}</span>
    </div>
  )
}

export default Timer
