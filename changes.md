# Change Log

Keep this file current whenever the project behaviour or learning flow changes. Add new entries at the top with a short summary and, when relevant, the validation used.

## 2026-11-12

- Fixed Vercel asset paths by building with the root base path on Vercel, while preserving the `/cos750-exam/` base path used by GitHub Pages.
- Validation: production builds passed with and without `VERCEL=1`; generated asset URLs use `/assets/` on Vercel and `/cos750-exam/assets/` for GitHub Pages.

## 2026-11-11

Aligns the app with the SE and ID documents and adds tests. Branch: `ishe-doc-alignment`.

- Fixed two diagrams that contradicted their own text: quiz Q4 and the Lesson 1 "not a BST" example were drawn with `buildTree()`, which always makes a valid BST. Both are now written out by hand, and lesson sections accept an explicit `tree`.
- Final mastery check (FR14, ID 4.7.4): 10 questions, one per outcome, 8 of 10 to pass, fresh questions on a retake, missed outcomes linked back to their lessons.
- Lecture-ready card: mastered outcomes, questions to bring to the lecture, first-attempt quiz scores against the final score, wallpaper download and the misconception CSV export (FR22).
- Misconception-targeted feedback (FR11): every wrong option in `questions.json` now carries a tag defined in `misconceptions.json`; the feedback names the mix-up and addresses it.
- Rewards (FR15 to FR17): banner and wallpaper definitions in `content/rewards.json`, a reward gallery at `#rewards`, the chosen banner shown in the header. Rewards are never removed by a failed retry.
- Scaffolding rules moved into `assessment/rules.js`: hints drop after two correct answers in a row, rise after a wrong one, and each new lesson starts one level lighter (ID 4.7.3).
- Get started resumes a returning student at their first unmastered lesson (SE 4.6).
- Reduced-motion setting (FR20), also following the OS preference; YouTube captions on by default (NFR5).
- Visualiser: "PATH TAKEN" label for insert/search, each form shows its own error, "Start from an empty tree", 0.5x speed, no highlighted line on the final traversal step, consistent product name.
- Student-facing clean-up: removed wireframe screen captions and the question-pool warning, outcome codes replaced by their text.
- CI: `.github/workflows/ci.yml` runs tests and the build on every push and pull request; `deploy.yml` publishes to GitHub Pages when run by hand.
- Validation: 86 tests passed (9 files); production build passed. Browser checks covered quiz fail/retry/pass, hint levels across lessons, mastery check fail and pass, lecture-ready card, CSV and wallpaper downloads, reward gallery, resume, visualiser fixes and 390px layouts on every page.

## 2026-11-10

- Documentation refresh for the project overview and setup instructions in the README, aligning the project description with the current four-lesson BST tutor flow.
- Updated the changelog to reflect the completed course progression features, quiz-based unlocking, optional activity/video support, course reset, and the persisted learner state.
- No runtime code changes in this update; documentation only.

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
