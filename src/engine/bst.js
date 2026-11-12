// Binary search tree operations that return step snapshots.
// Pure JavaScript, no React imports.
//
// A tree is either null (empty) or a frozen node { key, left, right }.
// Operations never mutate their input: insert copies only the nodes on the
// path to the new node (path copying) and shares every other subtree.
// Duplicate keys are ignored (the tree is returned unchanged).

import { makeNode, makeSnapshot, SOUNDS } from './snapshots.js';

export const INSERT_PSEUDOCODE = Object.freeze([
  'insert(node, key):',
  '  if node is empty: place a new node with key here',
  '  if key == node.key: do nothing (no duplicates)',
  '  if key < node.key: insert(node.left, key)',
  '  else: insert(node.right, key)',
]);

export const SEARCH_PSEUDOCODE = Object.freeze([
  'search(node, key):',
  '  if node is empty: return NOT FOUND',
  '  if key == node.key: return FOUND',
  '  if key < node.key: return search(node.left, key)',
  '  else: return search(node.right, key)',
]);

function assertKey(key) {
  if (typeof key !== 'number' || !Number.isFinite(key)) {
    throw new TypeError(`BST keys must be finite numbers, got ${String(key)}`);
  }
}

/**
 * Insert `key` into `tree`.
 * @returns {object[]} step snapshots; the resulting tree is `steps.at(-1).tree`.
 */
export function insert(tree, key) {
  assertKey(key);
  const steps = [];
  const visited = [];
  const push = (fields) => steps.push(makeSnapshot({ tree, visited, ...fields }));

  push({
    highlightedNode: tree ? tree.key : null,
    pseudocodeLine: 0,
    narration: tree
      ? `Insert ${key}. Start at the root (${tree.key}).`
      : `Insert ${key} into an empty tree.`,
  });

  // Walk down, remembering the path so we can rebuild it afterwards.
  const path = [];
  let node = tree;
  while (node !== null) {
    visited.push(node.key);
    if (key === node.key) {
      push({
        highlightedNode: node.key,
        pseudocodeLine: 2,
        narration: `${key} is already in the tree, so nothing is inserted.`,
        sound: SOUNDS.COMPARE,
      });
      return steps;
    }
    const dir = key < node.key ? 'left' : 'right';
    push({
      highlightedNode: node.key,
      pseudocodeLine: dir === 'left' ? 3 : 4,
      narration:
        dir === 'left'
          ? `${key} < ${node.key}, so go left.`
          : `${key} > ${node.key}, so go right.`,
      sound: dir === 'left' ? SOUNDS.GO_LEFT : SOUNDS.GO_RIGHT,
    });
    path.push({ node, dir });
    node = node[dir];
  }

  // Rebuild the path bottom-up with the new leaf attached.
  let rebuilt = makeNode(key);
  for (let i = path.length - 1; i >= 0; i--) {
    const { node: n, dir } = path[i];
    rebuilt = dir === 'left' ? makeNode(n.key, rebuilt, n.right) : makeNode(n.key, n.left, rebuilt);
  }

  const parent = path.at(-1);
  visited.push(key);
  steps.push(
    makeSnapshot({
      tree: rebuilt,
      visited,
      highlightedNode: key,
      pseudocodeLine: 1,
      narration: parent
        ? `Empty spot found: ${key} becomes the ${parent.dir} child of ${parent.node.key}.`
        : `The tree is empty, so ${key} becomes the root.`,
      sound: SOUNDS.INSERT,
    }),
  );
  return steps;
}

/**
 * Search `tree` for `key`.
 * @returns {object[]} step snapshots; the last one has sound FOUND or NOT_FOUND.
 */
export function search(tree, key) {
  assertKey(key);
  const steps = [];
  const visited = [];
  const push = (fields) => steps.push(makeSnapshot({ tree, visited, ...fields }));

  push({
    highlightedNode: tree ? tree.key : null,
    pseudocodeLine: 0,
    narration: tree
      ? `Search for ${key}. Start at the root (${tree.key}).`
      : `Search for ${key} in an empty tree.`,
  });

  let node = tree;
  while (node !== null) {
    visited.push(node.key);
    if (key === node.key) {
      push({
        highlightedNode: node.key,
        pseudocodeLine: 2,
        narration: `${key} == ${node.key}: found it after ${visited.length} comparison(s).`,
        sound: SOUNDS.FOUND,
      });
      return steps;
    }
    const goLeft = key < node.key;
    push({
      highlightedNode: node.key,
      pseudocodeLine: goLeft ? 3 : 4,
      narration: goLeft ? `${key} < ${node.key}, so go left.` : `${key} > ${node.key}, so go right.`,
      sound: goLeft ? SOUNDS.GO_LEFT : SOUNDS.GO_RIGHT,
    });
    node = goLeft ? node.left : node.right;
  }

  push({
    highlightedNode: null,
    pseudocodeLine: 1,
    narration: `Reached an empty spot: ${key} is not in the tree.`,
    sound: SOUNDS.NOT_FOUND,
  });
  return steps;
}

/** Build a tree by inserting `keys` in the given order. */
export function buildTree(keys) {
  return keys.reduce((tree, key) => insert(tree, key).at(-1).tree, null);
}

/** Number of nodes. */
export function size(tree) {
  return tree === null ? 0 : 1 + size(tree.left) + size(tree.right);
}

/** Height counted in levels: empty tree = 0, a single node = 1. */
export function height(tree) {
  return tree === null ? 0 : 1 + Math.max(height(tree.left), height(tree.right));
}

/**
 * True when every key in each left subtree is smaller than its node and every
 * key in each right subtree is larger (the whole-subtree BST rule).
 * Used to check hand-written "not a BST" diagrams in the content files.
 */
export function isValidBST(tree, min = -Infinity, max = Infinity) {
  if (tree === null) return true;
  if (tree.key <= min || tree.key >= max) return false;
  return isValidBST(tree.left, min, tree.key) && isValidBST(tree.right, tree.key, max);
}
