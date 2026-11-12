import { useState } from 'react';
import { HINTS_PER_LESSON } from '../assessment/rules.js';

const HINTS = {
  1: [
    'A leaf has no children; a subtree includes its starting node and every node below it.',
    'The BST rule applies to every value in each subtree, not just the direct children.',
    'A BST does not need to be balanced; check whether every left-side value is smaller and every right-side value is larger.',
  ],
  2: [
    'Begin at the root and compare the target with one node at a time.',
    'Go left when the target is smaller and right when it is larger; stop when you find a match.',
    'An EMPTY link is the insertion spot. Keep the given insertion order; do not sort it first.',
  ],
  3: [
    'Pre-order visits the node first; in-order visits it between its left and right subtrees.',
    'Post-order visits the node after both subtrees. Empty subtrees contribute no keys.',
    'For a BST, in-order is ascending: left subtree, node, then right subtree.',
  ],
  4: [
    'A BST search follows one path from the root; the tree height determines how many nodes it may visit.',
    'A shallow tree has a shorter search path than a chain-shaped tree.',
    'Sorted insertions can create a chain and O(n) search; an ordinary BST does not guarantee balance.',
  ],
};

export default function HintPanel({ lessonId, hintsUsed, visible, onUseHint }) {
  const [showOkay, setShowOkay] = useState(false);
  const exhausted = hintsUsed >= HINTS_PER_LESSON;
  const visibleHint = HINTS[lessonId]?.[hintsUsed - 1];

  function requestHint() {
    if (exhausted) {
      setShowOkay(true);
      return;
    }
    setShowOkay(false);
    onUseHint();
  }

  return (
    <section className="quiz-hint" aria-label="Question hint">
      <button type="button" onClick={requestHint}>
        {exhausted ? 'More hints' : `Use hint (${HINTS_PER_LESSON - hintsUsed} remaining)`}
      </button>
      {showOkay ? (
        <textarea aria-label="Hint response" readOnly rows="1" value="okay" />
      ) : visible && visibleHint ? (
        <p role="status">{visibleHint}</p>
      ) : null}
    </section>
  );
}
