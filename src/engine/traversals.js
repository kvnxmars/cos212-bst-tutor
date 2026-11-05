// Uninformed depth-first traversals (pre-order, in-order, post-order)
// that return step snapshots. Pure JavaScript, no React imports.
//
// `visited` in each snapshot is the output sequence so far, so the final
// snapshot's `visited` is the full traversal output.

import { makeSnapshot, SOUNDS } from './snapshots.js';

export const ORDERS = Object.freeze(['preorder', 'inorder', 'postorder']);

export const PSEUDOCODE = Object.freeze({
  preorder: Object.freeze([
    'preorder(node):',
    '  if node is empty: return',
    '  visit(node)',
    '  preorder(node.left)',
    '  preorder(node.right)',
  ]),
  inorder: Object.freeze([
    'inorder(node):',
    '  if node is empty: return',
    '  inorder(node.left)',
    '  visit(node)',
    '  inorder(node.right)',
  ]),
  postorder: Object.freeze([
    'postorder(node):',
    '  if node is empty: return',
    '  postorder(node.left)',
    '  postorder(node.right)',
    '  visit(node)',
  ]),
});

// The three actions in each order, mapped to their pseudocode line.
const PLAN = Object.freeze({
  preorder: [['visit', 2], ['left', 3], ['right', 4]],
  inorder: [['left', 2], ['visit', 3], ['right', 4]],
  postorder: [['left', 2], ['right', 3], ['visit', 4]],
});

const LABEL = { preorder: 'Pre-order', inorder: 'In-order', postorder: 'Post-order' };

/**
 * Depth-first traversal of `tree` in the given order.
 * @param {object|null} tree
 * @param {'preorder'|'inorder'|'postorder'} order
 * @returns {object[]} step snapshots
 */
export function traverse(tree, order) {
  if (!ORDERS.includes(order)) {
    throw new RangeError(`Unknown traversal order "${order}". Use one of: ${ORDERS.join(', ')}`);
  }
  const steps = [];
  const visited = [];
  const push = (fields) => steps.push(makeSnapshot({ tree, visited, ...fields }));

  if (tree === null) {
    push({ pseudocodeLine: 1, narration: 'The tree is empty, so there is nothing to visit.' });
    return steps;
  }

  const walk = (node) => {
    push({ highlightedNode: node.key, pseudocodeLine: 0, narration: `Arrive at ${node.key}.` });

    for (const [action, line] of PLAN[order]) {
      if (action === 'visit') {
        visited.push(node.key);
        push({
          highlightedNode: node.key,
          pseudocodeLine: line,
          narration: `Visit ${node.key}: output so far is ${visited.join(', ')}.`,
          sound: SOUNDS.VISIT,
        });
        continue;
      }

      const child = node[action];
      if (child === null) {
        push({
          highlightedNode: node.key,
          pseudocodeLine: line,
          narration: `${node.key} has no ${action} child: that subtree is empty, so return straight away.`,
        });
        continue;
      }

      push({
        highlightedNode: node.key,
        pseudocodeLine: line,
        narration: `Go to the ${action} child of ${node.key} (${child.key}).`,
        sound: action === 'left' ? SOUNDS.GO_LEFT : SOUNDS.GO_RIGHT,
      });
      walk(child);
      push({
        highlightedNode: node.key,
        pseudocodeLine: line,
        narration: `Finished the subtree rooted at ${child.key}; back at ${node.key}.`,
      });
    }
  };

  walk(tree);
  push({
    highlightedNode: null,
    pseudocodeLine: 0,
    narration: `${LABEL[order]} traversal complete: ${visited.join(', ')}.`,
  });
  return steps;
}

export const preOrder = (tree) => traverse(tree, 'preorder');
export const inOrder = (tree) => traverse(tree, 'inorder');
export const postOrder = (tree) => traverse(tree, 'postorder');

/** Convenience: just the output sequence of a traversal. */
export function traversalOutput(tree, order) {
  return [...traverse(tree, order).at(-1).visited];
}
