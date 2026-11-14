# Quizzy

A playful quiz UI built with Vite and React. The sample quiz data is hard-coded in `src/components/App.jsx`, and each component's styles live alongside it in a CSS module.

## Thinking in React

The UI is split at the points where content or behavior has a clear responsibility:

- `App` owns the current screen and switches between the start, question, and result views.
- `StartScreen` presents quiz setup controls; `Question` displays one question and its answer choices.
- `ProgressBar`, `Timer`, and `ScoreBoard` are small display components that receive their values through props.
- `ResultScreen` composes the score display and provides a way to return to the start screen.

For this first UI pass, React state is limited to the active screen in `App`. The category, difficulty, question count, question content, timer, and result are sample values rather than quiz logic. The setup controls and answer choices are native, uncontrolled form inputs; connecting their values to a real quiz flow can be the next step.

## Scripts

- `npm run dev` starts the Vite development server.
- `npm run build` creates the production build.
- `npm run lint` runs Oxlint.
