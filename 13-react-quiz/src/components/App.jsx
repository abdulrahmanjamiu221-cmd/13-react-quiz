import { useEffect, useReducer } from 'react'
import Question from './Question.jsx'
import ResultScreen from './ResultScreen.jsx'
import StartScreen from './StartScreen.jsx'
import styles from './App.module.css'

const initialState = {
  status: 'idle',
  questions: [],
  index: 0,
  answer: null,
  points: 0,
  secondsRemaining: 15 * 60,
  highscore: 0,
}

const sampleQuestions = [
  {
    prompt: 'Which planet is known as the Red Planet?',
    answers: ['Venus', 'Mars', 'Jupiter', 'Mercury'],
    correctAnswer: 1,
  },
  {
    prompt: 'What is the largest ocean on Earth?',
    answers: ['Atlantic', 'Indian', 'Pacific', 'Arctic'],
    correctAnswer: 2,
  },
  {
    prompt: 'How many sides does a hexagon have?',
    answers: ['Five', 'Six', 'Seven', 'Eight'],
    correctAnswer: 1,
  },
  {
    prompt: 'Which animal is the tallest in the world?',
    answers: ['Elephant', 'Ostrich', 'Giraffe', 'Camel'],
    correctAnswer: 2,
  },
  {
    prompt: 'What do bees collect from flowers to make honey?',
    answers: ['Nectar', 'Dew', 'Seeds', 'Petals'],
    correctAnswer: 0,
  },
]

function finishQuiz(state) {
  return {
    ...state,
    status: 'finished',
    highscore: Math.max(state.highscore, state.points),
  }
}

function quizReducer(state, action) {
  switch (action.type) {
    case 'start':
      if (state.status === 'ready') {
        return { ...state, status: 'active' }
      }
      if (state.status === 'idle' || state.status === 'error') {
        return {
          ...initialState,
          status: 'loading',
          highscore: state.highscore,
        }
      }
      return state
    case 'dataReceived':
      if (state.status !== 'loading') return state
      if (!Array.isArray(action.questions) || action.questions.length === 0) {
        return { ...state, status: 'error' }
      }
      return {
        ...state,
        status: 'ready',
        questions: action.questions,
        index: 0,
        answer: null,
        points: 0,
        secondsRemaining: 15 * 60,
      }
    case 'dataFailed':
      return state.status === 'loading' ? { ...state, status: 'error' } : state
    case 'newAnswer': {
      if (state.status !== 'active' || state.answer !== null) return state
      const question = state.questions[state.index]
      if (
        !Number.isInteger(action.answer) ||
        action.answer < 0 ||
        action.answer >= question.answers.length
      ) {
        return state
      }
      return {
        ...state,
        answer: action.answer,
        points: state.points + (action.answer === question.correctAnswer ? 1 : 0),
      }
    }
    case 'nextQuestion':
      if (
        state.status !== 'active' ||
        state.answer === null ||
        state.index >= state.questions.length - 1
      ) {
        return state
      }
      return { ...state, index: state.index + 1, answer: null }
    case 'finish':
      if (
        state.status !== 'active' ||
        state.answer === null ||
        state.index !== state.questions.length - 1
      ) {
        return state
      }
      return finishQuiz(state)
    case 'restart':
      return { ...initialState, highscore: state.highscore }
    case 'tick':
      if (state.status !== 'active') return state
      if (state.secondsRemaining <= 1) return finishQuiz(state)
      return { ...state, secondsRemaining: state.secondsRemaining - 1 }
    default:
      throw new Error(`Unknown quiz action: ${action.type}`)
  }
}

function App() {
  const [state, dispatch] = useReducer(quizReducer, initialState)
  const totalQuestions = state.questions.length
  const question = state.questions[state.index]

  useEffect(() => {
    if (state.status !== 'loading') return undefined

    const timeoutId = window.setTimeout(() => {
      dispatch({ type: 'dataReceived', questions: sampleQuestions })
    }, 350)

    return () => window.clearTimeout(timeoutId)
  }, [state.status])

  useEffect(() => {
    if (state.status !== 'active') return undefined

    const intervalId = window.setInterval(() => {
      dispatch({ type: 'tick' })
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [state.status])

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <a
          className={styles.brand}
          href="#home"
          onClick={(event) => {
            event.preventDefault()
            dispatch({ type: 'restart' })
          }}
          aria-label="Quizzy home"
        >
          <span className={styles.brandMark} aria-hidden="true">Q</span>
          <span>quizzy<span className={styles.brandDot}>.</span></span>
        </a>
        <span className={styles.headerNote}>A little quiz, a lot of fun</span>
        <span className={styles.avatar} aria-label="Your profile">✦</span>
      </header>

      <main className={styles.main}>
        {state.status === 'idle' && (
          <StartScreen onStart={() => dispatch({ type: 'start' })} />
        )}
        {state.status === 'loading' && (
          <section className={styles.statusCard} aria-live="polite">
            <span className={styles.loader} aria-hidden="true" />
            <h1>Getting your quiz ready...</h1>
            <p>Sharpening those pencils ✦</p>
          </section>
        )}
        {state.status === 'ready' && (
          <section className={styles.statusCard} aria-labelledby="ready-heading">
            <span className={styles.statusIcon} aria-hidden="true">✦</span>
            <h1 id="ready-heading">You&apos;re all set!</h1>
            <p>{totalQuestions} questions are ready. Take a breath, then let&apos;s go.</p>
            <button type="button" onClick={() => dispatch({ type: 'start' })}>
              Start quiz <span aria-hidden="true">→</span>
            </button>
          </section>
        )}
        {state.status === 'active' && question && (
          <Question
            question={question}
            category="Curious minds"
            difficulty="Easy"
            questionNumber={state.index + 1}
            totalQuestions={totalQuestions}
            answer={state.answer}
            secondsRemaining={state.secondsRemaining}
            onAnswer={(answer) => dispatch({ type: 'newAnswer', answer })}
            onNext={() => {
              if (state.index === totalQuestions - 1) {
                dispatch({ type: 'finish' })
              } else {
                dispatch({ type: 'nextQuestion' })
              }
            }}
          />
        )}
        {state.status === 'finished' && (
          <ResultScreen
            score={state.points}
            totalQuestions={totalQuestions}
            highscore={state.highscore}
            onPlayAgain={() => dispatch({ type: 'restart' })}
          />
        )}
        {state.status === 'error' && (
          <section className={styles.statusCard} aria-labelledby="error-heading">
            <span className={styles.statusIcon} aria-hidden="true">!</span>
            <h1 id="error-heading">Quiz didn&apos;t load</h1>
            <p>Something went wrong getting the questions. Give it another try.</p>
            <button type="button" onClick={() => dispatch({ type: 'start' })}>
              Try again <span aria-hidden="true">↻</span>
            </button>
          </section>
        )}
      </main>
      <footer className={styles.footer}>
        Made for curious minds <span aria-hidden="true">✳</span>
      </footer>
    </div>
  )
}

export default App
