# Sprint log

## 2026-11-05
- Scaffolded Vite + React (JavaScript) app, package `cos750-exam`, `base: '/cos750-Exam/'`, Vitest.
- Implemented `src/engine/bst.js` (insert, search) and `src/engine/traversals.js` (pre/in/post-order) returning step snapshots.
- Added `tests/engine.test.js`.

## 2026-11-14
- Added sound cues for correct / incorrect answers (`src/audio/sound.js`, files in `public/sounds/`) and a **Sound** On/Off switch in Settings. 8 new tests in `tests/sound.test.js`.
- Added read-aloud megaphone button for quiz questions (recordings Q01-Q25 in `public/sounds/`, linked via `audio` in `questions.json`) and a crowd cheer when the mastery check is passed. 100 tests passing.
- Read-aloud recordings `M01.mp3` to `M10.mp3` linked to the mastery-only questions M1 to M10 (`audio` field in `questions.json`); replaced `lecture_ready_crowd_cheers.mp3` with a shorter (~4 s) version.
- Mastery check: optional "Retake the check" on the pass screen and the lecture-ready card (pass, wallpaper and best score kept).
- The Lecture Ready wallpaper is now also a dark forest-and-gold colour theme, unlocked by passing the mastery check and applied on the first pass; selectable in Settings and the Rewards gallery. 101 tests passing.
- Welcome page: round "?" button beside the Home breadcrumb downloads the user manual (`public/COS212-BST-Tutor-User-Manual.pdf`).
