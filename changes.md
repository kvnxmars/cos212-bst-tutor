# Change Log

Keep this file up to date whenever project files or behavior change. Add new entries at the top and include a brief summary of the change and any relevant validation.

## 2026-11-07

- Added wireframe-based placeholder pages for learning-style selection and the Lesson 2 video view, with hash navigation to the existing visualizer.
- Added responsive layouts and placeholder interactions for captions, transcript, lesson format, and pending lesson content.
- Refactored the visualizer out of `App.jsx` into `pages/Visualizer.jsx` and reusable tree, control, playback, and pseudocode components.
- Updated visualizer playback controls to provide Back, Play/Pause, Next, Reset, and adjustable playback speed.
- Updated the README to describe the multi-page app and its current placeholders.
- Validation: `npm test` passed (26 tests; 2 skipped and 2 todo); `npm run build` passed; browser checks covered page navigation, playback, and mobile layouts.
