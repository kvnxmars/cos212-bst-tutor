# Change Log

Keep this file up to date whenever project files or behavior change. Add new entries at the top and include a brief summary of the change and any relevant validation.

## 2026-11-10

- Clarified progression: lesson activities and videos are optional; passing the quick quiz (at least 3 of 4) is required to unlock the next lesson.
- Added a confirmed “Start course over” action throughout the course that clears quiz progress and rewards and returns the learner to Lesson 1.
- Validation: 38 tests passed (2 skipped and 2 todo); production build passed; `git diff --check` passed. Browser checks confirmed locked lessons without prior quiz mastery, quiz-based unlocking, optional activity/video guidance, course reset confirmation (decline preserves progress; accept clears it and returns to Lesson 1) from a lesson and the visualiser, and mobile header placement.

## 2026-11-10

- Added a distinct BST video for each of the four lessons, with lesson-specific viewing guidance.
- Reworked the generic tree-building exercise into four algorithm-aligned activities: label tree parts and repair a BST violation; trace a search path and insert 65; build selectable pre-order, in-order, and post-order visit sequences; compare insertion orders by height/search comparisons and choose between a BST and sorted array for different workloads.
- Added drag-and-drop and click-to-place interactions with feedback, reset controls, and completion guidance.
- Validation: 37 tests passed (2 skipped and 2 todo); production build passed. Browser checks exercised the Lesson 1 repair, Lesson 2 insertion path, Lesson 3 traversal sequences, Lesson 4 shape/structure choices, and distinct video metadata. The test browser could not load YouTube embeds because its requests were redirected by the external network.

## 2026-11-10

- Replaced the learning-style Settings control with a “Try another way” menu linking to a YouTube BST video and a hands-on tree-building activity.
- Added the incomplete-tree challenge with drag-and-drop and click placement, BST comparison feedback, progress, reset, and completion guidance.
- Added lesson-specific navigation between the lesson, video, tree challenge, and visualiser.
- Incorporated the main-branch visualiser fixes: step-accurate stats, scrollable tree canvas, non-colour-only node states, arrow-key stepping, and stricter numeric input validation.
- Validation: `npm test` passed (33 tests; 2 skipped and 2 todo); `npm run build` passed; browser checks covered lesson links, challenge tutoring and completion, and visualiser step stats. YouTube playback could not be verified in the test browser because of a Google redirect.

## 2026-11-10

- Added a welcome-page button that opens Lesson 1. The earlier learning-format Settings control was subsequently replaced by the “Try another way” activities above.
- Validation: pending.

## 2026-11-10

- Built the four-page learning flow from the updated materials and wireframes: welcome, lessons, BST visualiser, and quick quiz.
- Added four lesson content sets, outcome-aware question selection, feedback, retry scaffolding, mastery tracking, and browser-persisted progress.
- Kept the visualiser's BST logic and responsive layout, adding lesson navigation and progress context.
- Updated the README to describe the implemented pages and saved progress.
- Validation: 29 tests passed (2 skipped and 2 todo); production build passed. Browser checks covered pass and fail quiz flows, retry question refresh, locked quiz access, page navigation, and 320px layouts.

## 2026-11-07

- Added wireframe-based placeholder pages for learning-style selection and the Lesson 2 video view, with hash navigation to the existing visualizer.
- Added responsive layouts and placeholder interactions for captions, transcript, lesson format, and pending lesson content.
- Refactored the visualizer out of `App.jsx` into `pages/Visualizer.jsx` and reusable tree, control, playback, and pseudocode components.
- Updated visualizer playback controls to provide Back, Play/Pause, Next, Reset, and adjustable playback speed.
- Updated the README to describe the multi-page app and its current placeholders.
- Validation: `npm test` passed (26 tests; 2 skipped and 2 todo); `npm run build` passed; browser checks covered page navigation, playback, and mobile layouts.
