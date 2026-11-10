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

export default function TreeView({ tree, snapshot }) {
  if (tree === null) {
    return <div className="empty-tree">Build a tree or insert a value to begin.</div>;
  }

  const layout = treeLayout(tree);
  const visited = new Set(snapshot?.visited ?? []);

  return (
    <div className="tree-scroll">
      <svg
        className="tree-svg"
        width={layout.width}
        height={layout.height}
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
              {isCurrent && <circle className="current-ring" cx={node.x} cy={node.y} r="30" />}
              <circle className="node-body" cx={node.x} cy={node.y} r="24" />
              <text x={node.x} y={node.y + 5} textAnchor="middle">{node.key}</text>
              {isVisited && !isCurrent && (
                <g className="visited-badge" aria-hidden="true">
                  <circle cx={node.x + 18} cy={node.y - 18} r="8" />
                  <path d={`M ${node.x + 14} ${node.y - 18} l 3 3 l 5 -6`} />
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}