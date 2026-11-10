const HINTS = {
  1: 'Nudge: identify the node or rule named in the question before choosing.',
  2: 'Rule: check the whole subtree, or follow the comparison at each visited node.',
  3: 'Step by step: start at the root, apply the BST rule at each node, and do not skip a level.',
};

export default function HintPanel({ level, visible, onToggle }) {
  return (
    <section className="quiz-hint" aria-label="Question hint">
      <button type="button" onClick={onToggle} disabled={level === 0}>
        {level === 0 ? 'No hint needed' : `Hint (${level} of 3)`}
      </button>
      {visible && level > 0 && <p role="status">{HINTS[level]}</p>}
      {level < 3 && <span>Hints fade as your answers improve.</span>}
    </section>
  );
}
