# Quizzy

A playful quiz UI built with Vite and React. Categories and 10-question multiple-choice quizzes load from Open Trivia DB. Each component's styles live alongside it in a CSS module.

## Thinking in React

The UI is split at the points where content or behavior has a clear responsibility:

- `App` owns the current screen and switches between the start, question, and result views.
- `StartScreen` presents quiz setup controls; `Question` displays one question and its answer choices.
- `ProgressBar`, `Timer`, and `ScoreBoard` are small display components that receive their values through props.
- `ResultScreen` composes the score display and provides a way to return to the start screen.

`App` uses `useReducer` for the related quiz state: status, loaded questions, current index and answer, points, remaining seconds, and high score. The reducer handles the quiz's transitions (`start`, loading success/failure, answering, advancing, finishing, restarting, and timer ticks) in one place. Categories and questions are fetched from Open Trivia DB. HTML entities are decoded into plain strings before React renders them, and choices are shuffled once as the response arrives.

Values such as the number of questions, maximum possible points, current progress, and the correctness of a choice are derived from that state instead of stored separately. This avoids duplicated values drifting out of sync—for example, a progress value that no longer matches the current question index. Answer feedback is derived by comparing the submitted answer with the question's correct answer.

Choose `useReducer` over several `useState` calls when one user action updates several related values or when transitions need explicit guards. A reducer makes those transitions easy to inspect and keeps coordinated updates (such as resetting a quiz without losing its high score) together. For a few independent values with simple updates, separate `useState` calls are usually simpler.

Effects declare the values that determine when their work must restart: category loading depends on the retry counter, question loading on quiz status, and the timer on active status and question index. Each async fetch uses an `AbortController` that is aborted in cleanup; the timer interval is cleared in cleanup. This prevents stale requests and intervals from surviving a screen change or unmount.

React 19 Strict Mode runs an extra development-only effect setup/cleanup cycle to expose effects that are not safe to repeat or clean up. The aborted first fetch and cleared first interval are intentional; production does not run this extra cycle. The setup form's question count is fixed at 10 to match the requested API query.

## Scripts

- `npm run dev` starts the Vite development server.
- `npm run build` creates the production build.
- `npm run lint` runs Oxlint.
