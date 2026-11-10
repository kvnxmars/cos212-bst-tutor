import { useState } from 'react';
import TreeView from '../TreeView.jsx';
import { buildTree } from '../../engine/bst.js';

const TERMS = ['Root', 'Parent', 'Child', 'Leaf', 'Subtree'];
const DEFINITIONS = [
  { id: 'root', text: 'The top node; it has no parent.', expected: 'Root' },
  { id: 'parent', text: 'A node directly above another node.', expected: 'Parent' },
  { id: 'child', text: 'A node directly below another node.', expected: 'Child' },
  { id: 'leaf', text: 'A node with no children.', expected: 'Leaf' },
  { id: 'subtree', text: 'A node together with all the nodes below it.', expected: 'Subtree' },
];

const BROKEN_TREE = {
  key: 50,
  left: {
    key: 30,
    left: { key: 20, left: null, right: null },
    right: { key: 60, left: null, right: null },
  },
  right: { key: 70, left: null, right: null },
};

function termFeedback(term, definition) {
  if (term === definition.expected) {
    return { correct: true, message: `Correct: ${definition.expected.toLowerCase()} means ${definition.text.toLowerCase()}` };
  }
  const meaning = DEFINITIONS.find((item) => item.expected === term);
  return { correct: false, message: `Not quite. ${meaning.expected} means “${meaning.text}”` };
}

export default function TreePartsChallenge() {
  const [placements, setPlacements] = useState({});
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [message, setMessage] = useState('Drag a tree term onto its definition, or select a term and then a definition.');
  const [isCorrect, setIsCorrect] = useState(null);
  const [selectedRepair, setSelectedRepair] = useState(false);
  const [violationFound, setViolationFound] = useState(false);
  const [treeRepaired, setTreeRepaired] = useState(false);
  const allTermsPlaced = Object.keys(placements).length === DEFINITIONS.length;
  const availableTerms = TERMS.filter((term) => !Object.values(placements).includes(term));

  function placeTerm(definition, term = selectedTerm) {
    if (!term) {
      setMessage('Choose a term first, then place it on the definition it matches.');
      setIsCorrect(null);
      return;
    }

    const feedback = termFeedback(term, definition);
    setMessage(feedback.message);
    setIsCorrect(feedback.correct);
    if (!feedback.correct) return;

    setPlacements((current) => ({ ...current, [definition.id]: term }));
    setSelectedTerm(null);
    setMessage(Object.keys(placements).length + 1 === DEFINITIONS.length
      ? 'Nice work. Now use those tree parts to inspect the BST rule.'
      : feedback.message);
  }

  function chooseTerm(term) {
    setSelectedTerm((current) => current === term ? null : term);
    setMessage(`${term} selected. Drag it to a definition, or choose a definition card.`);
    setIsCorrect(null);
  }

  function identifyViolation(key) {
    if (key === 60) {
      setViolationFound(true);
      setMessage('Yes. 60 is greater than the root 50, but it is inside 50’s left subtree. BST rules apply to the entire subtree, not only direct children.');
      setIsCorrect(true);
    } else {
      setMessage(`${key} respects its position. Trace the BST rule from the root to check every ancestor.`);
      setIsCorrect(false);
    }
  }

  function repairTree(key = selectedRepair ? 60 : null) {
    if (key !== 60) {
      setMessage('Select or drag the misplaced 60 to its correct position.');
      setIsCorrect(null);
      return;
    }
    setTreeRepaired(true);
    setSelectedRepair(false);
    setMessage('Repaired. 60 is greater than 50, so it belongs in 50’s right subtree; it is less than 70, so it becomes 70’s left child.');
    setIsCorrect(true);
  }

  function reset() {
    setPlacements({});
    setSelectedTerm(null);
    setSelectedRepair(false);
    setViolationFound(false);
    setTreeRepaired(false);
    setMessage('Drag a tree term onto its definition, or select a term and then a definition.');
    setIsCorrect(null);
  }

  return (
    <div className="lesson-activity">
      <section className="activity-stage" aria-labelledby="tree-terms-title">
        <div className="activity-stage-heading">
          <div><p className="eyebrow">LEVEL 1 · TREE PARTS</p><h2 id="tree-terms-title">Name that part</h2></div>
          <span>{Object.keys(placements).length} / {DEFINITIONS.length} matched</span>
        </div>
        <p>Match each term to its meaning. You can drag the labels or use the buttons.</p>
        <div className="term-tray" aria-label="Tree terms">
          {availableTerms.map((term) => (
            <button
              type="button"
              key={term}
              className={`term-tile${selectedTerm === term ? ' is-selected' : ''}`}
              aria-pressed={selectedTerm === term}
              draggable
              onClick={() => chooseTerm(term)}
              onDragStart={(event) => {
                event.dataTransfer.setData('text/plain', term);
                event.dataTransfer.effectAllowed = 'move';
                setSelectedTerm(term);
              }}
            >
              {term}
            </button>
          ))}
        </div>
        <div className="definition-grid">
          {DEFINITIONS.map((definition) => {
            const term = placements[definition.id];
            return (
              <button
                type="button"
                key={definition.id}
                className={`definition-drop-card${term ? ' is-filled' : ''}`}
                onClick={() => placeTerm(definition)}
                onDragOver={(event) => {
                  if (!term) event.preventDefault();
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  if (!term) placeTerm(definition, event.dataTransfer.getData('text/plain'));
                }}
                aria-label={`${definition.text}${term ? ` Matched with ${term}.` : ' Drop a term here.'}`}
              >
                {term && <strong>{term}</strong>}
                <span>{definition.text}</span>
              </button>
            );
          })}
        </div>
      </section>

      {allTermsPlaced && (
        <section className="activity-stage" aria-labelledby="bst-rule-title">
          <div className="activity-stage-heading">
            <div><p className="eyebrow">LEVEL 2 · BST DETECTIVE</p><h2 id="bst-rule-title">Find and fix the rule-breaker</h2></div>
          </div>
          <p>Every left-subtree value must be smaller than its ancestor. Every right-subtree value must be larger. Which key is out of place?</p>
          <figure className="activity-tree-figure">
            <TreeView tree={treeRepaired ? buildTree([50, 30, 70, 20, 60]) : BROKEN_TREE} snapshot={null} />
            <figcaption>{treeRepaired ? 'The BST rule now holds at every node.' : 'One node breaks the BST rule even though its immediate parent looks reasonable.'}</figcaption>
          </figure>
          {!violationFound && (
            <div className="violation-options" aria-label="Choose the misplaced key">
              {[20, 30, 50, 60, 70].map((key) => (
                <button type="button" className="tree-node-tile" key={key} onClick={() => identifyViolation(key)}>{key}</button>
              ))}
            </div>
          )}
          {violationFound && !treeRepaired && (
            <div className="repair-instruction">
              <p>Drag 60 into the right subtree: place it as the left child of 70.</p>
              <button
                type="button"
                className="term-tile"
                draggable
                onClick={() => setSelectedRepair(true)}
                onDragStart={(event) => {
                  event.dataTransfer.setData('text/plain', '60');
                  event.dataTransfer.effectAllowed = 'move';
                  setSelectedRepair(true);
                }}
              >
                60
              </button>
              <button
                type="button"
                className="repair-drop-target"
                onClick={() => repairTree()}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  repairTree(Number(event.dataTransfer.getData('text/plain')));
                }}
              >
                Left child of 70
              </button>
            </div>
          )}
        </section>
      )}

      <div className={`tree-tutor-feedback ${isCorrect === null ? '' : isCorrect ? 'is-correct' : 'is-incorrect'}`} role="status" aria-live="polite">
        <strong>{treeRepaired ? 'BST repaired' : isCorrect === false ? 'Try another comparison' : 'Your tutor'}</strong>
        <p>{message}</p>
      </div>
      <button className="tree-challenge-reset" type="button" onClick={reset}>Start this activity over</button>
    </div>
  );
}
