import ProgressBar from './ProgressBar.jsx'
import Timer from './Timer.jsx'
import styles from './Question.module.css'

function Question({
  question,
  category,
  difficulty,
  questionNumber,
  totalQuestions,
  onFinish,
}) {
  return (
    <section className={styles.screen} aria-labelledby="question-prompt">
      <div className={styles.topline}>
        <div className={styles.tags}>
          <span className={styles.category}>{category}</span>
          <span className={styles.difficulty}>{difficulty}</span>
        </div>
        <Timer time="15:00" />
      </div>

      <ProgressBar current={questionNumber} total={totalQuestions} />

      <div className={styles.questionCard}>
        <div className={styles.questionMeta}>
          <span>QUESTION {String(questionNumber).padStart(2, '0')}</span>
          <span className={styles.sparkle} aria-hidden="true">✳</span>
        </div>
        <h1 id="question-prompt">{question.prompt}</h1>

        <fieldset className={styles.answers}>
          <legend className={styles.visuallyHidden}>Choose your answer</legend>
          {question.answers.map((answer, index) => (
            <label className={styles.answer} key={answer}>
              <input type="radio" name="answer" value={answer} />
              <span className={styles.letter}>{String.fromCharCode(65 + index)}</span>
              <span>{answer}</span>
              <span className={styles.answerArrow} aria-hidden="true">↗</span>
            </label>
          ))}
        </fieldset>

        <div className={styles.cardFooter}>
          <span><span aria-hidden="true">↵</span> Select an answer to lock it in</span>
          <button type="button" onClick={onFinish}>
            Finish quiz <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
      <p className={styles.encouragement}><span aria-hidden="true">✦</span> You&apos;ve got this!</p>
    </section>
  )
}

export default Question
