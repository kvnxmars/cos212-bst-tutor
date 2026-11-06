# Branch: COS212 BST Tutor

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

1. Enter comma-separated numbers and build a tree.
2. Select insert, search, or a depth-first traversal.
3. Run the operation, then step backward and forward through the snapshots.

The visualization, narration, visited sequence, and highlighted pseudocode line all come from the same engine snapshot.

## Engine modules

- `src/engine/bst.js`: insertion, search, tree construction, size, and height.
- `src/engine/traversals.js`: pre-order, in-order, and post-order traversal.
- `src/engine/snapshots.js`: immutable tree nodes, step snapshots, and sound cue identifiers.

Engine tests live in `tests/`. The interface is in `src/App.jsx`, with its styles in `src/styles/theme.css`.
