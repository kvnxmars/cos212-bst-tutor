const TRAVERSALS = ['preorder', 'inorder', 'postorder'];

export default function PseudocodePanel({ pseudocode, snapshot, operation, finished = false }) {
  const isTraversal = TRAVERSALS.includes(operation);
  // The "traversal complete" step is not a line of the algorithm, so nothing is highlighted.
  const activeLine = isTraversal && finished ? -1 : snapshot?.pseudocodeLine;

  return (
    <aside className="code-panel">
      <p className="eyebrow">FOLLOW THE LOGIC</p>
      <h2>Pseudocode</h2>
      <ol className="pseudocode-list">
        {pseudocode.map((line, index) => (
          <li key={`${operation}-${index}`} className={activeLine === index ? 'active-line' : ''}>
            <span>{String(index + 1).padStart(2, '0')}</span><code>{line}</code>
          </li>
        ))}
      </ol>
      <div className="output-box">
        <span className="output-label">{isTraversal ? 'VISIT ORDER' : 'PATH TAKEN'}</span>
        <p>{snapshot?.visited.length ? snapshot.visited.join('  →  ') : '—'}</p>
      </div>
    </aside>
  );
}