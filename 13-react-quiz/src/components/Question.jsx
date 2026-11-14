import ProgressBar from './ProgressBar.jsx'
import Timer from './Timer.jsx'
import styles from './Question.module.css'

function Question({
  question,
  category,
  difficulty,
  questionNumber,
  totalQuestions,
  answer: selectedAnswer,
  secondsRemaining,
  onAnswer,
  onNext,
}) {
  return (
    <section className={styles.screen} aria-labelledby="question-prompt">
      <div className={styles.topline}>
        <div className={styles.tags}>
          <span className={styles.category}>{category}</span>
          <span className={styles.difficulty}>{difficulty}</span>
        </div>
        <Timer secondsRemaining={secondsRemaining} />
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
          {question.answers.map((option, index) => (
            <button
              className={styles.answer}
              data-result={
                selectedAnswer === null
                  ? undefined
                  : index === question.correctAnswer
                    ? 'correct'
                    : index === selectedAnswer
                      ? 'incorrect'
                      : undefined
              }
              disabled={selectedAnswer !== null}
              key={option}
              onClick={() => onAnswer(index)}
              type="button"
            >
              <span className={styles.letter}>{String.fromCharCode(65 + index)}</span>
              <span>{option}</span>
              <span className={styles.answerArrow} aria-hidden="true">↗</span>
            </button>
          ))}
        </fieldset>

        <div className={styles.cardFooter}>
          <span>
            <span aria-hidden="true">{selectedAnswer === null ? '↵' : '✦'}</span>
            {selectedAnswer === null ? 'Choose an answer to lock it in' : 'Answer locked in!'}
          </span>
          {selectedAnswer !== null && (
            <button type="button" onClick={onNext}>
              {questionNumber === totalQuestions ? 'See results' : 'Next'}
              <span aria-hidden="true">→</span>
            </button>
          )}
        </div>
      </div>
      <p className={styles.encouragement}><span aria-hidden="true">✦</span> You&apos;ve got this!</p>
    </section>
  )
}

export default Question
