import ScoreBoard from './ScoreBoard.jsx'
import styles from './ResultScreen.module.css'

function ResultScreen({ score, totalQuestions, highscore, onPlayAgain }) {
  const didGreat = score / totalQuestions >= 0.6

  return (
    <section className={styles.screen} aria-labelledby="result-heading">
      <div className={styles.confetti} aria-hidden="true">
        <span>✦</span><span>✳</span><span>•</span><span>✦</span><span>•</span>
      </div>
      <div className={styles.card}>
        <div className={styles.badge} aria-hidden="true">{didGreat ? '🏆' : '🌱'}</div>
        <p className={styles.eyebrow}>QUIZ COMPLETE</p>
        <h1 id="result-heading">{didGreat ? 'Look at you go!' : 'Nice try!'}</h1>
        <p className={styles.message}>
          {didGreat
            ? 'Your brain was on fire. Keep that curious streak going!'
            : 'Every quiz makes you a little sharper. Ready for another?'}
        </p>
        <ScoreBoard score={score} totalQuestions={totalQuestions} />
        <p className={styles.highscore}>
          Best score: <strong>{highscore} / {totalQuestions}</strong>
        </p>
        <button className={styles.playAgain} type="button" onClick={onPlayAgain}>
          Play again <span aria-hidden="true">↻</span>
        </button>
        <p className={styles.signoff}>Thanks for playing, brainiac <span aria-hidden="true">♡</span></p>
      </div>
    </section>
  )
}

export default ResultScreen
