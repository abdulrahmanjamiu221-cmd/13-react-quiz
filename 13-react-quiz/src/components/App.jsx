import { useEffect, useReducer, useRef, useState } from 'react'
import Question from './Question.jsx'
import ResultScreen from './ResultScreen.jsx'
import StartScreen from './StartScreen.jsx'
import styles from './App.module.css'

const SECONDS_PER_QUESTION = 15
const initialState = {
  status: 'idle',
  questions: [],
  index: 0,
  answer: null,
  points: 0,
  secondsRemaining: SECONDS_PER_QUESTION,
  highscore: 0,
}

const responseCodeMessages = {
  1: 'There are not enough questions for those settings. Try another category or difficulty.',
  2: 'The trivia service did not accept those quiz settings. Please try again.',
  3: 'The trivia session could not be found. Please try again.',
  4: 'The trivia session has run out of questions. Please try again.',
  5: 'The trivia service is receiving too many requests. Wait a moment and try again.',
}

function decodeHtmlEntities(value) {
  const textarea = document.createElement('textarea')
  textarea.innerHTML = value
  return textarea.value
}

function shuffleAnswers(answers) {
  const shuffled = [...answers]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const answer = shuffled[index]
    shuffled[index] = shuffled[swapIndex]
    shuffled[swapIndex] = answer
  }
  return shuffled
}

function normalizeQuestions(results) {
  return results.map((item) => {
    if (
      typeof item.question !== 'string' ||
      typeof item.category !== 'string' ||
      typeof item.difficulty !== 'string' ||
      typeof item.correct_answer !== 'string' ||
      !Array.isArray(item.incorrect_answers) ||
      item.incorrect_answers.length !== 3
    ) {
      throw new Error('The trivia service returned an invalid question.')
    }

    const answers = shuffleAnswers([
      { text: decodeHtmlEntities(item.correct_answer), correct: true },
      ...item.incorrect_answers.map((answer) => ({
        text: decodeHtmlEntities(answer),
        correct: false,
      })),
    ])

    return {
      prompt: decodeHtmlEntities(item.question),
      category: decodeHtmlEntities(item.category),
      difficulty: item.difficulty[0].toUpperCase() + item.difficulty.slice(1),
      answers: answers.map((answer) => answer.text),
      correctAnswer: answers.findIndex((answer) => answer.correct),
    }
  })
}

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
        secondsRemaining: SECONDS_PER_QUESTION,
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
      return {
        ...state,
        index: state.index + 1,
        answer: null,
        secondsRemaining: SECONDS_PER_QUESTION,
      }
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
  const [categories, setCategories] = useState([])
  const [categoriesStatus, setCategoriesStatus] = useState('loading')
  const [categoriesError, setCategoriesError] = useState('')
  const [categoryRetry, setCategoryRetry] = useState(0)
  const [quizError, setQuizError] = useState('')
  const quizSettingsRef = useRef({ categoryId: '9', difficulty: 'easy' })
  const totalQuestions = state.questions.length
  const question = state.questions[state.index]

  useEffect(() => {
    const controller = new AbortController()

    async function loadCategories() {
      setCategoriesStatus('loading')
      setCategoriesError('')

      try {
        const response = await fetch('https://opentdb.com/api_category.php', {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error(`Category request failed (${response.status}).`)
        }

        const data = await response.json()
        if (!Array.isArray(data.trivia_categories)) {
          throw new Error('The trivia service returned an invalid category list.')
        }

        setCategories(data.trivia_categories)
        setCategoriesStatus('ready')
      } catch (error) {
        if (controller.signal.aborted) return
        setCategoriesError(
          error instanceof Error ? error.message : 'Could not load quiz categories.',
        )
        setCategoriesStatus('error')
      }
    }

    loadCategories()
    return () => controller.abort()
  }, [categoryRetry])

  useEffect(() => {
    if (state.status !== 'loading') return undefined

    const controller = new AbortController()

    async function loadQuestions() {
      try {
        const { categoryId, difficulty } = quizSettingsRef.current
        const query = new URLSearchParams({
          amount: '10',
          category: categoryId,
          difficulty,
          type: 'multiple',
        })
        const response = await fetch(`https://opentdb.com/api.php?${query}`, {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error(`Question request failed (${response.status}).`)
        }

        const data = await response.json()
        if (data.response_code !== 0) {
          throw new Error(
            responseCodeMessages[data.response_code] ??
              `The trivia service returned error code ${data.response_code}.`,
          )
        }
        if (!Array.isArray(data.results) || data.results.length === 0) {
          throw new Error('The trivia service did not return any questions.')
        }

        dispatch({ type: 'dataReceived', questions: normalizeQuestions(data.results) })
      } catch (error) {
        if (controller.signal.aborted) return
        setQuizError(error instanceof Error ? error.message : 'Could not load quiz questions.')
        dispatch({ type: 'dataFailed' })
      }
    }

    loadQuestions()
    return () => controller.abort()
  }, [state.status])

  useEffect(() => {
    if (state.status !== 'active') return undefined

    const intervalId = window.setInterval(() => {
      dispatch({ type: 'tick' })
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [state.status, state.index])

  function handleStart(settings) {
    quizSettingsRef.current = settings
    setQuizError('')
    dispatch({ type: 'start' })
  }

  function retryCategories() {
    setCategoriesError('')
    setCategoriesStatus('loading')
    setCategoryRetry((retry) => retry + 1)
  }

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
          <StartScreen
            categories={categories}
            categoriesStatus={categoriesStatus}
            categoriesError={categoriesError}
            onRetryCategories={retryCategories}
            onStart={handleStart}
          />
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
            category={question.category}
            difficulty={question.difficulty}
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
            <p>{quizError || 'Something went wrong getting the questions. Give it another try.'}</p>
            <button type="button" onClick={() => handleStart(quizSettingsRef.current)}>
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
