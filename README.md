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

The app opens on the learning-style selection placeholder. Continue to the lesson placeholder, then choose **Try it in the visualiser** to reach the interactive BST workbench. The lesson video and quiz content are placeholders until their lesson plans are ready.

The visualization, narration, visited sequence, and highlighted pseudocode line all come from the same engine snapshot.

## Engine modules

- `src/engine/bst.js`: insertion, search, tree construction, size, and height.
- `src/engine/traversals.js`: pre-order, in-order, and post-order traversal.
- `src/engine/snapshots.js`: immutable tree nodes, step snapshots, and sound cue identifiers.

Engine tests live in `tests/`. `src/App.jsx` selects the learning-style, lesson, or visualizer page based on the URL hash. The visualizer page lives in `src/pages/Visualizer.jsx`; its tree view, operation controls, playback controls, and pseudocode panel are reusable components in `src/components/`, with shared styles in `src/styles/theme.css`.
