import { buildTree, height } from './bst.js';
import { traversalOutput } from './traversals.js';

export const SEARCH_INSERTION_CHALLENGE = Object.freeze({
  values: Object.freeze([50, 70, 60, 65]),
  slots: Object.freeze([
    'Start at the root',
    '65 > 50: go right',
    '65 < 70: go left',
    'Empty right link of 60',
  ]),
});

export const TRAVERSAL_CHALLENGE_KEYS = Object.freeze([50, 30, 70, 20, 40, 60, 80]);

export function getSearchInsertionFeedback(value, slotIndex) {
  const expected = SEARCH_INSERTION_CHALLENGE.values[slotIndex];
  if (value === expected) {
    if (slotIndex === 3) {
      return {
        correct: true,
        message: 'Exactly. 65 is not in the tree, and the empty right link of 60 is where it should be inserted.',
      };
    }
    return {
      correct: true,
      message: `Correct: compare 65 with ${value}${value < 65 ? ' and go right' : value > 65 ? ' and go left' : ' and stop'}.`,
    };
  }

  const next = SEARCH_INSERTION_CHALLENGE.values[slotIndex];
  if (slotIndex === 3) {
    return { correct: false, message: `The search reaches 60, then 65 > 60, so use its empty right link. The inserted value is 65.` };
  }
  return {
    correct: false,
    message: `At step ${slotIndex + 1}, compare 65 with ${next}. ${65 < next ? 'Go left.' : 65 > next ? 'Go right.' : 'The value is found.'}`,
  };
}

export function getTraversalStepFeedback(order, key, index) {
  const expected = traversalOutput(buildTree(TRAVERSAL_CHALLENGE_KEYS), order);
  if (key === expected[index]) {
    return { correct: true, message: `${key} is next: ${getTraversalReason(order, index)}.` };
  }
  return {
    correct: false,
    message: `${expected[index]} comes next. ${getTraversalReason(order, index)}.`,
  };
}

function getTraversalReason(order, index) {
  if (order === 'preorder') {
    if (index === 0) return 'pre-order visits the root before either subtree';
    return index < 4
      ? 'pre-order finishes the left subtree before moving to the right subtree'
      : 'pre-order visits the right subtree after the entire left subtree';
  }
  if (order === 'inorder') {
    if (index < 3) return 'in-order visits the left subtree in ascending key order';
    if (index === 3) return 'the left subtree is complete, so in-order now visits the root';
    return 'in-order visits the right subtree in ascending key order';
  }
  if (index === 6) return 'post-order visits the root only after both subtrees are complete';
  if (index === 2) return 'post-order visits 30 after both of its child subtrees';
  if (index === 5) return 'post-order visits 70 after both of its child subtrees';
  return 'post-order visits a node after its child subtrees';
}

function findSuccessfulComparisons(tree, key) {
  let node = tree;
  let comparisons = 0;
  while (node !== null) {
    comparisons += 1;
    if (node.key === key) return comparisons;
    node = key < node.key ? node.left : node.right;
  }
  return comparisons;
}

export function analyzeInsertionOrder(sequence) {
  const tree = buildTree(sequence);
  const treeHeight = height(tree);
  const totalComparisons = sequence.reduce(
    (total, key) => total + findSuccessfulComparisons(tree, key),
    0,
  );

  return {
    tree,
    height: treeHeight,
    averageSearchComparisons: Number((totalComparisons / sequence.length).toFixed(1)),
    isShallow: treeHeight <= 3,
  };
}
