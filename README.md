# COS212 BST Tutor

COS212 BST Tutor is a small interactive learning app for binary search trees (BSTs), tree operations, and depth-first traversals. The JavaScript engine provides deterministic tree logic and snapshots, while the React interface presents the lesson flow, visualiser, and challenges in a learner-friendly sequence.

## What this project includes

- A four-lesson learning flow starting from a welcome page and ending in a quiz-based mastery check.
- A BST visualiser with playback controls, step-by-step narration, traversal highlighting, and summary stats.
- Lesson-specific "Try another way" activities, including YouTube explanations and hands-on tree-building/practice tasks.
- Quiz feedback, retries, lesson unlocking, and browser-persisted course progress.
- A course reset flow that clears mastery state and starts the learner back at Lesson 1 after confirmation.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Run locally

From the project directory:

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite in the terminal.

Useful commands:

```powershell
npm test
npm run build
```

## Learning flow

The app is organised around a guided progression:

1. Welcome page and introductory lesson content.
2. Lesson pages with reading material and diagrams.
3. BST visualiser and step-through practice.
4. Optional lesson-specific activity/video guidance.
5. Quick quiz with feedback and retries.
6. Lesson unlocks based on quiz performance.

The lesson, quiz, video, and activity content is stored in `src/content/`. Student progress is saved in browser storage so the learner can resume without losing quiz progress or unlocked lessons.

## Main application structure

- `src/App.jsx`: route selection based on the URL hash.
- `src/pages/`: lesson, welcome, visualiser, video, quiz, and challenge pages.
- `src/components/`: reusable UI for the tree view, playback controls, pseudocode panel, and challenge interactions.
- `src/engine/`: BST logic, traversal utilities, immutable snapshots, and challenge state logic.
- `src/styles/theme.css`: shared visual styling.
- `tests/`: Vitest coverage for tree logic, scoring, quiz rules, and challenge behaviour.

## Engine modules

- `src/engine/bst.js`: insertion, search, tree construction, size, and height operations.
- `src/engine/traversals.js`: pre-order, in-order, and post-order traversal helpers.
- `src/engine/snapshots.js`: immutable node snapshots, step snapshots, and sound cues.
- `src/engine/learningChallenges.js` and `src/engine/treeChallenge.js`: lesson activity logic and tree-building challenge mechanics.

## Notes

This app is intended as a teaching aid for COS212 and was designed around the available course materials, sprint log, and wireframes in the project folder. It is best used in a browser with the Vite dev server running locally.
