import { useState } from 'react';
import TreeView from '../TreeView.jsx';
import { analyzeInsertionOrder } from '../../engine/learningChallenges.js';
import DragSequenceChallenge from './DragSequenceChallenge.jsx';

const VALUES = [1, 2, 3, 4, 5];
const SORTED_ANALYSIS = analyzeInsertionOrder(VALUES);

const SCENARIOS = [
  {
    id: 'lookups',
    prompt: 'The data is loaded once and searched often, with very few insertions.',
    answer: 'array',
    rationale: 'A sorted array supports O(log n) binary search and works well when values rarely change.',
  },
  {
    id: 'insertions',
    prompt: 'New values arrive often, and avoiding shifts of existing array items matters.',
    answer: 'bst',
    rationale: 'A BST can add a key without shifting array elements—but its height still controls the search cost.',
  },
];

export default function ComplexityChallenge() {
  const [sequence, setSequence] = useState(null);
  const [attemptedSequence, setAttemptedSequence] = useState(null);
  const [choices, setChoices] = useState({});
  const [scenarioFeedback, setScenarioFeedback] = useState({});
  const isComplete = sequence !== null;

  function evaluate(sequenceItems) {
    const analysis = analyzeInsertionOrder(sequenceItems);
    if (!analysis.isShallow) {
      return {
        correct: false,
        message: `This order makes a chain with height ${analysis.height} and about ${analysis.averageSearchComparisons} comparisons per successful search. Try putting a middle value near the root, then split the remaining values on each side.`,
      };
    }

    return {
      correct: true,
      message: `Nice! This order makes a BST of height ${analysis.height}, the minimum for five nodes. Its average successful search takes ${analysis.averageSearchComparisons} comparisons.`,
      summary: 'You made a shallow tree. Compare its height with the chain before making the structure-choice decisions below.',
    };
  }

  function chooseStructure(scenario, structure) {
    setChoices((current) => ({ ...current, [scenario.id]: structure }));
    setScenarioFeedback((current) => ({
      ...current,
      [scenario.id]: structure === scenario.answer
        ? scenario.rationale
        : scenario.id === 'lookups'
          ? 'Consider the update pattern: with few insertions, a sorted array stays simple and binary search is fast.'
          : 'Frequent array insertions can shift many items. A BST avoids those shifts, but it can still become a slow chain.',
    }));
  }

  function resetActivity() {
    setSequence(null);
    setAttemptedSequence(null);
    setChoices({});
    setScenarioFeedback({});
  }

  const arrangedAnalysis = attemptedSequence ? analyzeInsertionOrder(attemptedSequence) : null;

  return (
    <div className="lesson-activity">
      <section className="activity-stage" aria-labelledby="complexity-title">
        <div className="activity-stage-heading">
          <div><p className="eyebrow">SHAPE CHANGES COST</p><h2 id="complexity-title">Build a shorter search path</h2></div>
        </div>
        <p>Drag 1–5 into an insertion order that keeps the BST shallow. Compare your result with the chain made by sorted insertion.</p>
        <div className="tree-comparison-activity">
          <figure className="activity-tree-figure">
            <TreeView tree={SORTED_ANALYSIS.tree} snapshot={null} />
            <figcaption>Sorted order: height {SORTED_ANALYSIS.height}; average successful search uses {SORTED_ANALYSIS.averageSearchComparisons} comparisons.</figcaption>
          </figure>
          {arrangedAnalysis && (
            <figure className="activity-tree-figure">
              <TreeView tree={arrangedAnalysis.tree} snapshot={null} />
              <figcaption>Your order: height {arrangedAnalysis.height}; average successful search uses {arrangedAnalysis.averageSearchComparisons} comparisons.</figcaption>
            </figure>
          )}
        </div>
        <DragSequenceChallenge
          items={VALUES}
          slotLabels={VALUES.map((_, index) => `Insert ${index + 1}`)}
          instruction="All five keys must be used. You may return a placed key to the tray and change your order."
          acceptAnyOrder
          evaluate={evaluate}
          onAttempt={setAttemptedSequence}
          onComplete={(items) => setSequence(items)}
          onReset={resetActivity}
          resetKey="tree-shape"
        />
      </section>

      {isComplete && (
        <section className="activity-stage" aria-labelledby="structure-choice-title">
          <div className="activity-stage-heading">
            <div><p className="eyebrow">PICK THE RIGHT TOOL</p><h2 id="structure-choice-title">Choose for the workload</h2></div>
          </div>
          <p>A shallow BST can be fast, but an ordinary BST does not rebalance itself. The right structure also depends on how the data changes.</p>
          <div className="structure-scenarios">
            {SCENARIOS.map((scenario) => (
              <article className="structure-scenario" key={scenario.id}>
                <h3>{scenario.prompt}</h3>
                <div>
                  <button
                    type="button"
                    className={choices[scenario.id] === 'array' ? 'is-selected' : ''}
                    aria-pressed={choices[scenario.id] === 'array'}
                    onClick={() => chooseStructure(scenario, 'array')}
                  >
                    Sorted array
                  </button>
                  <button
                    type="button"
                    className={choices[scenario.id] === 'bst' ? 'is-selected' : ''}
                    aria-pressed={choices[scenario.id] === 'bst'}
                    onClick={() => chooseStructure(scenario, 'bst')}
                  >
                    Binary search tree
                  </button>
                </div>
                {choices[scenario.id] && (
                  <p className={choices[scenario.id] === scenario.answer ? 'is-correct' : 'is-guidance'}>
                    {choices[scenario.id] === scenario.answer ? 'Good fit. ' : 'Try again. '}
                    {scenarioFeedback[scenario.id]}
                  </p>
                )}
              </article>
            ))}
          </div>
          <p className="complexity-reminder">Remember: a balanced BST can search in O(log n); a chain-shaped BST can need O(n).</p>
        </section>
      )}
    </div>
  );
}
