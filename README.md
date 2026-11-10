# COS212 BST Tutor

A small interactive tutor for binary search trees and depth-first traversals. The algorithm engine is framework-independent JavaScript; the React interface visualizes its immutable step snapshots.

## Requirements

- Node.js 20.19+ or 22.12+ (required by the current Vite version)
- npm

## Run locally

From the project directory:

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite. To run the engine tests and create a production build:

```powershell
npm test
npm run build
```

## Use the tutor

The app guides learners through four lessons and several activity pages:

1. Welcome page and lesson pages with reading content and diagrams.
2. An interactive BST visualiser with step playback.
3. "Try another way" activities tailored to each lesson: a lesson-specific YouTube explanation and drag-and-drop practice in tree terminology/BST rules, search and insertion, traversal order, or tree-shape/search-cost analysis.
4. Four-question quick quizzes with feedback, retries, and lesson unlocking.

The lesson, quiz, and video information is in `src/content/`. Quiz progress and mastered lessons are saved in the browser. The visualiser's narration, visited sequence, and highlighted pseudocode line all come from the same engine snapshot.

## Engine modules

- `src/engine/bst.js`: insertion, search, tree construction, size, and height.
- `src/engine/traversals.js`: pre-order, in-order, and post-order traversal.
- `src/engine/snapshots.js`: immutable tree nodes, step snapshots, and sound cue identifiers.

Tests live in `tests/`. `src/App.jsx` selects the page based on the URL hash. The visualiser page lives in `src/pages/Visualizer.jsx`; its tree view, operation controls, playback controls, and pseudocode panel are reusable components in `src/components/`, with shared styles in `src/styles/theme.css`.
