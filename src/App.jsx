import { useState } from 'react';
import {
  buildTree,
  height,
  insert,
  INSERT_PSEUDOCODE,
  search,
  SEARCH_PSEUDOCODE,
  size,
} from './engine/bst.js';
import { PSEUDOCODE, traverse } from './engine/traversals.js';
import './styles/theme.css';

const STARTING_KEYS = [50, 30, 70, 20, 40, 60, 80];

function treeLayout(tree) {
  const nodes = [];
  const edges = [];
  let index = 0;
  let deepest = 0;

  function visit(node, depth = 0, parent = null) {
    if (node === null) return;
    visit(node.left, depth + 1, node);
    const position = { key: node.key, depth, index: index++ };
    nodes.push(position);
    if (parent) edges.push({ from: parent, to: position });
    visit(node.right, depth + 1, node);
    deepest = Math.max(deepest, depth);
  }

  visit(tree);
  const width = Math.max(620, nodes.length * 82 + 64);
  const gap = nodes.length ? (width - 64) / nodes.length : 0;
  const byKey = new Map(nodes.map((node) => [node.key, node]));
  const place = (node) => ({
    ...node,
    x: 32 + (node.index + 0.5) * gap,
    y: 54 + node.depth * 92,
  });

  return {
    nodes: nodes.map(place),
    edges: edges.map(({ from, to }) => ({ from: place(byKey.get(from.key)), to: place(to) })),
    width,
    height: Math.max(245, 96 + deepest * 92),
  };
}

function TreeCanvas({ tree, snapshot }) {
  const layout = treeLayout(tree);
  const visited = new Set(snapshot?.visited ?? []);

  if (tree === null) {
    return <div className="empty-tree">Build a tree or insert a value to begin.</div>;
  }

  return (
    <div className="tree-scroll">
      <svg
        className="tree-svg"
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        role="img"
        aria-label="Binary search tree visualization"
      >
        {layout.edges.map(({ from, to }) => (
          <line key={`${from.key}-${to.key}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} className="tree-edge" />
        ))}
        {layout.nodes.map((node) => {
          const isCurrent = snapshot?.highlightedNode === node.key;
          const isVisited = visited.has(node.key);
          return (
            <g key={node.key} className={`tree-node${isCurrent ? ' is-current' : ''}${isVisited ? ' is-visited' : ''}`}>
              <circle cx={node.x} cy={node.y} r="24" />
              <text x={node.x} y={node.y + 5} textAnchor="middle">{node.key}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function App() {
  const [tree, setTree] = useState(() => buildTree(STARTING_KEYS));
  const [keysInput, setKeysInput] = useState(STARTING_KEYS.join(', '));
  const [valueInput, setValueInput] = useState('45');
  const [operation, setOperation] = useState('insert');
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState('');

  const snapshot = steps[stepIndex] ?? null;
  const visibleTree = snapshot ? snapshot.tree : tree;
  const pseudocode = operation === 'insert'
    ? INSERT_PSEUDOCODE
    : operation === 'search'
      ? SEARCH_PSEUDOCODE
      : PSEUDOCODE[operation];

  function buildFromInput(event) {
    event.preventDefault();
    const values = keysInput.split(',').map((part) => part.trim()).filter(Boolean).map(Number);
    if (values.length === 0 || values.some((value) => !Number.isFinite(value))) {
      setError('Enter one or more finite numbers, separated by commas.');
      return;
    }
    setTree(buildTree(values));
    setSteps([]);
    setStepIndex(0);
    setError('');
  }

  function runOperation(event) {
    event.preventDefault();
    setError('');
    let nextSteps;
    if (operation === 'preorder' || operation === 'inorder' || operation === 'postorder') {
      nextSteps = traverse(tree, operation);
    } else {
      const value = Number(valueInput);
      if (valueInput.trim() === '' || !Number.isFinite(value)) {
        setError('Enter a finite number for this operation.');
        return;
      }
      nextSteps = operation === 'insert' ? insert(tree, value) : search(tree, value);
      if (operation === 'insert') setTree(nextSteps.at(-1).tree);
    }
    setSteps(nextSteps);
    setStepIndex(0);
  }

  function selectOperation(event) {
    setOperation(event.target.value);
    setSteps([]);
    setStepIndex(0);
  }

  function resetDemo() {
    setTree(buildTree(STARTING_KEYS));
    setKeysInput(STARTING_KEYS.join(', '));
    setSteps([]);
    setStepIndex(0);
    setError('');
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="wordmark" href="#home" aria-label="Branch, home"><span className="wordmark-mark">T</span>TRULinK<span className="wordmark-period">.</span></a>
        <div className="course-label">COS212 <span> / </span> DATA STRUCTURES</div>
        <button className="reset-button" type="button" onClick={resetDemo}>Reset demo</button>
      </header>

      <section className="intro" id="home">
        <div>
          <p className="eyebrow">BINARY SEARCH TREE LAB <span>01</span></p>
          <h1>Make every step <em>visible.</em></h1>
        </div>
        <p className="intro-copy">Build a tree, choose an operation, and follow the path the algorithm takes.</p>
      </section>

      <section className="workspace" aria-label="BST workbench">
        <aside className="controls-panel">
          <section className="control-group">
            <div className="section-heading"><span className="step-number">01</span><h2>Shape the tree</h2></div>
            <form onSubmit={buildFromInput}>
              <label htmlFor="tree-keys">Insert values in order</label>
              <div className="input-row">
                <input id="tree-keys" value={keysInput} onChange={(event) => setKeysInput(event.target.value)} />
                <button className="icon-button" type="submit" aria-label="Build tree" title="Build tree">↵</button>
              </div>
              <p className="field-note">Separate numbers with commas.</p>
            </form>
          </section>

          <section className="control-group operation-group">
            <div className="section-heading"><span className="step-number">02</span><h2>Run an operation</h2></div>
            <form onSubmit={runOperation}>
              <label htmlFor="operation">Operation</label>
              <select id="operation" value={operation} onChange={selectOperation}>
                <option value="insert">Insert a value</option>
                <option value="search">Search for a value</option>
                <option value="preorder">Pre-order traversal</option>
                <option value="inorder">In-order traversal</option>
                <option value="postorder">Post-order traversal</option>
              </select>
              {(operation === 'insert' || operation === 'search') && (
                <>
                  <label htmlFor="operation-value">Value</label>
                  <input id="operation-value" type="number" value={valueInput} onChange={(event) => setValueInput(event.target.value)} />
                </>
              )}
              <button className="run-button" type="submit">Run operation <span aria-hidden="true">→</span></button>
              {error && <p className="error-message" role="alert">{error}</p>}
            </form>
          </section>

          <div className="tree-stats" aria-label="Tree statistics">
            <div><span>NODES</span><strong>{size(tree)}</strong></div>
            <div><span>HEIGHT</span><strong>{height(tree)}</strong></div>
          </div>
        </aside>

        <section className="visual-panel" aria-label="Tree and operation steps">
          <div className="visual-heading">
            <div><p className="eyebrow">LIVE STRUCTURE</p><h2>Binary search tree</h2></div>
            <div className="legend"><span><i className="legend-current" />Current</span><span><i className="legend-visited" />Visited</span></div>
          </div>
          <TreeCanvas tree={visibleTree} snapshot={snapshot} />
          <div className="playback">
            <p className="narration" aria-live="polite">{snapshot?.narration ?? 'Ready when you are. Run an operation to see it unfold.'}</p>
            <div className="playback-controls">
              <span className="step-count">{steps.length ? `${stepIndex + 1} / ${steps.length}` : 'NO STEPS'}</span>
              <div>
                <button type="button" className="step-button" disabled={stepIndex <= 0} onClick={() => setStepIndex((current) => current - 1)} aria-label="Previous step" title="Previous step">←</button>
                <button type="button" className="step-button next-step" disabled={stepIndex >= steps.length - 1} onClick={() => setStepIndex((current) => current + 1)} aria-label="Next step" title="Next step">→</button>
              </div>
            </div>
          </div>
        </section>

        <aside className="code-panel">
          <p className="eyebrow">FOLLOW THE LOGIC</p>
          <h2>Pseudocode</h2>
          <ol className="pseudocode-list">
            {pseudocode.map((line, index) => (
              <li key={`${operation}-${index}`} className={snapshot?.pseudocodeLine === index ? 'active-line' : ''}>
                <span>{String(index + 1).padStart(2, '0')}</span><code>{line}</code>
              </li>
            ))}
          </ol>
          <div className="output-box">
            <span className="output-label">VISIT ORDER</span>
            <p>{snapshot?.visited.length ? snapshot.visited.join('  →  ') : '—'}</p>
          </div>
        </aside>
      </section>
      <footer className="footer"><span>BRANCH / BST TUTOR</span><span>LEARN BY FOLLOWING THE PATH</span></footer>
    </main>
  );
}
