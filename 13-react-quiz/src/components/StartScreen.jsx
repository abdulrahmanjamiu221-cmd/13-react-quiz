import styles from './StartScreen.module.css'

const categories = ['General knowledge', 'Science', 'Nature', 'Pop culture']
const difficulties = ['Easy', 'Medium', 'Hard']

function StartScreen({ onStart }) {
  function handleSubmit(event) {
    event.preventDefault()
    onStart()
  }

  return (
    <section className={styles.screen} aria-labelledby="welcome-heading">
      <div className={styles.intro}>
        <span className={styles.eyebrow}><span aria-hidden="true">✳</span> YOUR NEXT BRAIN BREAK</span>
        <h1 id="welcome-heading">Ready, set, <span>quiz!</span></h1>
        <p>Pick your vibe, trust your gut, and see what you know.</p>
        <div className={styles.doodle} aria-hidden="true">?</div>
      </div>

      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.cardHeading}>
          <div>
            <h2>Make it yours</h2>
            <p>Choose your quiz settings to get started.</p>
          </div>
          <span className={styles.sparkle} aria-hidden="true">✦</span>
        </div>

        <label className={styles.field}>
          <span className={styles.label}>Pick a category</span>
          <span className={styles.selectWrap}>
            <select name="category" defaultValue={categories[0]}>
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
            <span aria-hidden="true">⌄</span>
          </span>
        </label>

        <fieldset className={styles.fieldset}>
          <legend className={styles.label}>How spicy?</legend>
          <div className={styles.difficultyOptions}>
            {difficulties.map((difficulty, index) => (
              <label className={styles.difficulty} key={difficulty}>
                <input
                  type="radio"
                  name="difficulty"
                  value={difficulty.toLowerCase()}
                  defaultChecked={index === 0}
                />
                <span>{difficulty}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className={styles.field}>
          <span className={styles.label}>Number of questions</span>
          <span className={styles.selectWrap}>
            <select name="questionCount" defaultValue="5">
              <option value="5">5 questions · quick & easy</option>
              <option value="10">10 questions · just right</option>
              <option value="15">15 questions · deep dive</option>
            </select>
            <span aria-hidden="true">⌄</span>
          </span>
        </label>

        <button className={styles.startButton} type="submit">
          Let&apos;s play <span aria-hidden="true">→</span>
        </button>
        <p className={styles.note}><span aria-hidden="true">♡</span> No pressure. Just for fun.</p>
      </form>

      <div className={styles.bottomNote}>
        <span aria-hidden="true">✺</span> GOOD VIBES &amp; GREAT GUESSES
      </div>
    </section>
  )
}

export default StartScreen
