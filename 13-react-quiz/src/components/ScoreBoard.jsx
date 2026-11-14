import styles from './ScoreBoard.module.css'

function ScoreBoard({ score, totalQuestions }) {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0

  return (
    <div className={styles.scoreboard}>
      <div
        className={styles.ring}
        role="img"
        aria-label={`${percentage} percent`}
        style={{ '--score': `${percentage}%` }}
      >
        <span>{percentage}<small>%</small></span>
      </div>
      <div className={styles.scoreText}>
        <span className={styles.label}>YOUR SCORE</span>
        <strong>{score}<span> / {totalQuestions}</span></strong>
        <span className={styles.caption}>correct answers</span>
      </div>
    </div>
  )
}

export default ScoreBoard
