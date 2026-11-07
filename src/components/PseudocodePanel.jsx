export default function PseudocodePanel({ pseudocode, snapshot, operation }) {
  return (
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
  );
}