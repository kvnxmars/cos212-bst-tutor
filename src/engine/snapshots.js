// Step snapshots: the only thing the UI ever receives from the engine.
// Pure JavaScript, no React imports.
//
// A snapshot is a frozen object:
//   tree            the whole tree at this step (immutable nodes, or null if empty)
//   highlightedNode key of the node in focus at this step, or null
//   visited         keys visited so far (search/insert: the comparison path;
//                   traversals: the output sequence)
//   pseudocodeLine  0-based index into the pseudocode array exported for the operation
//   narration       short plain-text description of the step
//   sound           a SOUNDS cue id, or null for silence

export const SOUNDS = Object.freeze({
  COMPARE: 'compare',
  GO_LEFT: 'go-left',
  GO_RIGHT: 'go-right',
  INSERT: 'insert',
  FOUND: 'found',
  NOT_FOUND: 'not-found',
  VISIT: 'visit',
});

export function makeSnapshot({
  tree = null,
  highlightedNode = null,
  visited = [],
  pseudocodeLine = 0,
  narration = '',
  sound = null,
} = {}) {
  return Object.freeze({
    tree,
    highlightedNode,
    visited: Object.freeze([...visited]),
    pseudocodeLine,
    narration,
    sound,
  });
}

// Tree nodes are frozen, so a snapshot's tree can never be changed by a later step.
export function makeNode(key, left = null, right = null) {
  return Object.freeze({ key, left, right });
}
