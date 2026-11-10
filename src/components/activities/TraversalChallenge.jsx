import { useState } from 'react';
import { buildTree } from '../../engine/bst.js';
import TreeView from '../TreeView.jsx';
import { getTraversalStepFeedback, TRAVERSAL_CHALLENGE_KEYS } from '../../engine/learningChallenges.js';
import DragSequenceChallenge from './DragSequenceChallenge.jsx';
import { traversalOutput } from '../../engine/traversals.js';

const ORDERS = [
  { id: 'preorder', label: 'Pre-order', rule: 'Node → left → right' },
  { id: 'inorder', label: 'In-order', rule: 'Left → node → right' },
  { id: 'postorder', label: 'Post-order', rule: 'Left → right → node' },
];

export default function TraversalChallenge() {
  const [order, setOrder] = useState('preorder');
  const [complete, setComplete] = useState(false);
  const tree = buildTree(TRAVERSAL_CHALLENGE_KEYS);
  const selectedOrder = ORDERS.find((item) => item.id === order);
  const output = traversalOutput(tree, order);

  function changeOrder(event) {
    setOrder(event.target.value);
    setComplete(false);
  }

  return (
    <div className="lesson-activity">
      <section className="activity-stage" aria-labelledby="traversal-title">
        <div className="activity-stage-heading">
          <div><p className="eyebrow">VISIT EVERY NODE</p><h2 id="traversal-title">Conduct a tree traversal</h2></div>
        </div>
        <p>Choose an order, then drag the keys into the sequence they are visited. The order changes when the visit rule changes.</p>
        <figure className="activity-tree-figure">
          <TreeView tree={tree} snapshot={null} />
          <figcaption>Finish each subtree before moving to the next one.</figcaption>
        </figure>
        <label className="activity-select-label" htmlFor="traversal-order">Traversal rule</label>
        <select id="traversal-order" value={order} onChange={changeOrder}>
          {ORDERS.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}
        </select>
        <p className="traversal-rule-callout"><strong>{selectedOrder.label}:</strong> {selectedOrder.rule}</p>
        <DragSequenceChallenge
          key={order}
          items={TRAVERSAL_CHALLENGE_KEYS}
          slotLabels={output.map((_, index) => `Visit ${index + 1}`)}
          instruction={`Build the ${selectedOrder.label.toLowerCase()} output sequence.`}
          getFeedback={(key, index) => getTraversalStepFeedback(order, key, index)}
          onComplete={() => setComplete(true)}
          onReset={() => setComplete(false)}
          resetKey={`traversal-${order}`}
        />
        {complete && (
          <p className="traversal-takeaway" role="status">
            {order === 'inorder'
              ? 'Because this is a BST, in-order visits left, node, then right—and outputs the keys in ascending order.'
              : `${selectedOrder.label} is not “sort the keys”: its output follows ${selectedOrder.rule.toLowerCase()} instead.`}
          </p>
        )}
      </section>
    </div>
  );
}
