export default function TreeControls({
  keysInput,
  onKeysInputChange,
  onBuildTree,
  operation,
  onOperationChange,
  valueInput,
  onValueInputChange,
  onRunOperation,
  onClearTree,
  buildError,
  runError,
  nodeCount,
  treeHeight,
}) {
  return (
    <aside className="controls-panel">
      <section className="control-group">
        <div className="section-heading"><span className="step-number">01</span><h2>Shape the tree</h2></div>
        <form onSubmit={onBuildTree}>
          <label htmlFor="tree-keys">Insert values in order</label>
          <div className="input-row">
            <input id="tree-keys" value={keysInput} onChange={onKeysInputChange} />
            <button className="icon-button" type="submit" aria-label="Build tree" title="Build tree">↵</button>
          </div>
          <p className="field-note">Separate numbers with commas.</p>
          {buildError && <p className="error-message" role="alert">{buildError}</p>}
          <button className="text-button" type="button" onClick={onClearTree}>Start from an empty tree</button>
        </form>
      </section>

      <section className="control-group operation-group">
        <div className="section-heading"><span className="step-number">02</span><h2>Run an operation</h2></div>
        <form onSubmit={onRunOperation}>
          <label htmlFor="operation">Operation</label>
          <select id="operation" value={operation} onChange={onOperationChange}>
            <option value="insert">Insert a value</option>
            <option value="search">Search for a value</option>
            <option value="preorder">Pre-order traversal</option>
            <option value="inorder">In-order traversal</option>
            <option value="postorder">Post-order traversal</option>
          </select>
          {(operation === 'insert' || operation === 'search') && (
            <>
              <label htmlFor="operation-value">Value</label>
              <input id="operation-value" type="number" value={valueInput} onChange={onValueInputChange} />
            </>
          )}
          <button className="run-button" type="submit">Run operation <span aria-hidden="true">→</span></button>
          {runError && <p className="error-message" role="alert">{runError}</p>}
        </form>
      </section>

      <div className="tree-stats" aria-label="Tree statistics">
        <div><span>NODES</span><strong>{nodeCount}</strong></div>
        <div><span>HEIGHT</span><strong>{treeHeight}</strong></div>
      </div>
    </aside>
  );
}
