import styles from './StartScreen.module.css'

const difficulties = ['Easy', 'Medium', 'Hard']

function StartScreen({
  categories,
  categoriesStatus,
  categoriesError,
  onRetryCategories,
  onStart,
}) {
  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    onStart({
      categoryId: formData.get('category'),
      difficulty: formData.get('difficulty'),
    })
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

        <div className={styles.field}>
          <label className={styles.label} htmlFor="category-select">Pick a category</label>
          <span className={styles.selectWrap}>
            <select
              id="category-select"
              name="category"
              defaultValue=""
              disabled={categoriesStatus !== 'ready'}
              required
            >
              <option value="" disabled>
                {categoriesStatus === 'loading' ? 'Loading categories...' : 'Select a category'}
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <span aria-hidden="true">⌄</span>
          </span>
          {categoriesStatus === 'error' && (
            <span className={styles.categoryError} role="alert">
              {categoriesError}
              <button type="button" onClick={onRetryCategories}>Try again</button>
            </span>
          )}
        </div>

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

        <div className={styles.field}>
          <span className={styles.label}>Number of questions</span>
          <span className={styles.selectWrap}>
            <span className={styles.fixedValue}>10 questions · just right</span>
          </span>
        </div>

        <button
          className={styles.startButton}
          type="submit"
          disabled={categoriesStatus !== 'ready'}
        >
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
