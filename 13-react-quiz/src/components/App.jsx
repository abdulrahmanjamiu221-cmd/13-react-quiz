import { useState } from 'react'
import Question from './Question.jsx'
import ResultScreen from './ResultScreen.jsx'
import StartScreen from './StartScreen.jsx'
import styles from './App.module.css'

const quiz = {
  category: 'Curious minds',
  difficulty: 'Easy',
  questions: [
    {
      prompt: 'Which planet is known as the Red Planet?',
      answers: ['Venus', 'Mars', 'Jupiter', 'Mercury'],
    },
    {
      prompt: 'What is the largest ocean on Earth?',
      answers: ['Atlantic', 'Indian', 'Pacific', 'Arctic'],
    },
    {
      prompt: 'How many sides does a hexagon have?',
      answers: ['Five', 'Six', 'Seven', 'Eight'],
    },
    {
      prompt: 'Which animal is the tallest in the world?',
      answers: ['Elephant', 'Ostrich', 'Giraffe', 'Camel'],
    },
    {
      prompt: 'What do bees collect from flowers?',
      answers: ['Nectar', 'Dew', 'Seeds', 'Pollen only'],
    },
  ],
}

function App() {
  const [screen, setScreen] = useState('start')
  const totalQuestions = quiz.questions.length

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <a
          className={styles.brand}
          href="#home"
          onClick={(event) => {
            event.preventDefault()
            setScreen('start')
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
        {screen === 'start' && (
          <StartScreen onStart={() => setScreen('question')} />
        )}
        {screen === 'question' && (
          <Question
            question={quiz.questions[0]}
            category={quiz.category}
            difficulty={quiz.difficulty}
            questionNumber={1}
            totalQuestions={totalQuestions}
            onFinish={() => setScreen('result')}
          />
        )}
        {screen === 'result' && (
          <ResultScreen
            score={4}
            totalQuestions={totalQuestions}
            onPlayAgain={() => setScreen('start')}
          />
        )}
      </main>
      <footer className={styles.footer}>
        Made for curious minds <span aria-hidden="true">✳</span>
      </footer>
    </div>
  )
}

export default App
