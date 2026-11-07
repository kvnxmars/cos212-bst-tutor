import { useEffect, useState } from 'react';
import {
  buildTree,
  height,
  insert,
  INSERT_PSEUDOCODE,
  search,
  SEARCH_PSEUDOCODE,
  size,
} from '../engine/bst.js';
import { PSEUDOCODE, traverse } from '../engine/traversals.js';
import PlaybackControls from '../components/PlaybackControls.jsx';
import PseudocodePanel from '../components/PseudocodePanel.jsx';
import TreeControls from '../components/TreeControls.jsx';
import TreeView from '../components/TreeView.jsx';
import '../styles/theme.css';

const STARTING_KEYS = [50, 30, 70, 20, 40, 60, 80];
const PLAYBACK_SPEEDS = [1, 1.5, 2];

export default function VisualizerPage() {
  const [tree, setTree] = useState(() => buildTree(STARTING_KEYS));
  const [keysInput, setKeysInput] = useState(STARTING_KEYS.join(', '));
  const [valueInput, setValueInput] = useState('45');
  const [operation, setOperation] = useState('insert');
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState('');

  const snapshot = steps[stepIndex] ?? null;
  const visibleTree = snapshot ? snapshot.tree : tree;
  const pseudocode = operation === 'insert'
    ? INSERT_PSEUDOCODE
    : operation === 'search'
      ? SEARCH_PSEUDOCODE
      : PSEUDOCODE[operation];

  useEffect(() => {
    if (steps.length === 0 || stepIndex >= steps.length - 1) {
      setIsPlaying(false);
    }
  }, [stepIndex, steps.length]);

  useEffect(() => {
    if (!isPlaying) return undefined;

    const timer = window.setInterval(() => {
      setStepIndex((current) => Math.min(current + 1, steps.length - 1));
    }, 1000 / speed);

    return () => window.clearInterval(timer);
  }, [isPlaying, speed, steps.length]);

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
    setIsPlaying(false);
    setError('');
  }

  function runOperation(event) {
    event.preventDefault();
    setError('');
    setIsPlaying(false);
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
    setIsPlaying(false);
  }

  function resetDemo() {
    setTree(buildTree(STARTING_KEYS));
    setKeysInput(STARTING_KEYS.join(', '));
    setSteps([]);
    setStepIndex(0);
    setIsPlaying(false);
    setError('');
  }

  function cycleSpeed() {
    setSpeed((current) => PLAYBACK_SPEEDS[
      (PLAYBACK_SPEEDS.indexOf(current) + 1) % PLAYBACK_SPEEDS.length
    ]);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="wordmark" href="#welcome" aria-label="Branch, home"><span className="wordmark-mark">T</span>TRULinK<span className="wordmark-period">.</span></a>
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
        <TreeControls
          keysInput={keysInput}
          onKeysInputChange={(event) => setKeysInput(event.target.value)}
          onBuildTree={buildFromInput}
          operation={operation}
          onOperationChange={selectOperation}
          valueInput={valueInput}
          onValueInputChange={(event) => setValueInput(event.target.value)}
          onRunOperation={runOperation}
          error={error}
          nodeCount={size(tree)}
          treeHeight={height(tree)}
        />

        <section className="visual-panel" aria-label="Tree and operation steps">
          <div className="visual-heading">
            <div><p className="eyebrow">LIVE STRUCTURE</p><h2>Binary search tree</h2></div>
            <div className="legend"><span><i className="legend-current" />Current</span><span><i className="legend-visited" />Visited</span></div>
          </div>
          <TreeView tree={visibleTree} snapshot={snapshot} />
          <div className="playback">
            <p className="narration" aria-live="polite">{snapshot?.narration ?? 'Ready when you are. Run an operation to see it unfold.'}</p>
            <PlaybackControls
              stepIndex={stepIndex}
              stepCount={steps.length}
              isPlaying={isPlaying}
              speed={speed}
              onBack={() => setStepIndex((current) => Math.max(0, current - 1))}
              onTogglePlay={() => setIsPlaying((current) => !current)}
              onNext={() => setStepIndex((current) => Math.min(current + 1, steps.length - 1))}
              onReset={() => {
                setStepIndex(0);
                setIsPlaying(false);
              }}
              onCycleSpeed={cycleSpeed}
            />
          </div>
        </section>

        <PseudocodePanel pseudocode={pseudocode} snapshot={snapshot} operation={operation} />
      </section>
      <footer className="footer"><span>BRANCH / BST TUTOR</span><span>LEARN BY FOLLOWING THE PATH</span></footer>
    </main>
  );
}
