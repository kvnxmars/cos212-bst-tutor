import { useState } from 'react';
import TreeView from '../TreeView.jsx';
import { buildTree } from '../../engine/bst.js';
import { getSearchInsertionFeedback, SEARCH_INSERTION_CHALLENGE } from '../../engine/learningChallenges.js';
import DragSequenceChallenge from './DragSequenceChallenge.jsx';

const STARTING_KEYS = [50, 30, 70, 20, 40, 60, 80];

export default function SearchInsertionChallenge() {
  const [complete, setComplete] = useState(false);

  return (
    <div className="lesson-activity">
      <section className="activity-stage" aria-labelledby="search-insert-title">
        <div className="activity-stage-heading">
          <div><p className="eyebrow">SEARCH THEN INSERT</p><h2 id="search-insert-title">Help 65 find its place</h2></div>
          <span>One comparison at a time</span>
        </div>
        <p>Search for 65 in this BST. Drag each key into the order you compare it, then place 65 at the empty link where the search ends.</p>
        <figure className="activity-tree-figure">
          <TreeView tree={buildTree(STARTING_KEYS)} snapshot={null} />
          <figcaption>Start at 50. A smaller target goes left; a larger target goes right.</figcaption>
        </figure>
        <DragSequenceChallenge
          items={SEARCH_INSERTION_CHALLENGE.values}
          slotLabels={SEARCH_INSERTION_CHALLENGE.slots}
          instruction="Arrange the search path: root → comparisons → empty insertion link."
          getFeedback={getSearchInsertionFeedback}
          onComplete={() => setComplete(true)}
          onReset={() => setComplete(false)}
          resetKey="search-insertion"
        />
      </section>
      {complete && (
        <section className="activity-stage" aria-label="Tree after inserting 65">
          <div className="activity-stage-heading">
            <div><p className="eyebrow">INSERTION RESULT</p><h2>Existing nodes stay where they are</h2></div>
          </div>
          <figure className="activity-tree-figure">
            <TreeView tree={buildTree([...STARTING_KEYS, 65])} snapshot={null} />
            <figcaption>65 is attached as the right child of 60. Insertion follows the search path; it does not rearrange existing nodes.</figcaption>
          </figure>
        </section>
      )}
    </div>
  );
}
