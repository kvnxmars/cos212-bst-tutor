import { describe, it, expect } from 'vitest';
import {
  insert,
  search,
  buildTree,
  size,
  height,
  INSERT_PSEUDOCODE,
  SEARCH_PSEUDOCODE,
} from '../src/engine/bst.js';
import { traverse, traversalOutput, ORDERS, PSEUDOCODE } from '../src/engine/traversals.js';
import { SOUNDS } from '../src/engine/snapshots.js';

//          50
//       30     70
//     20  40  60  80
const KNOWN_KEYS = [50, 30, 70, 20, 40, 60, 80];
const known = () => buildTree(KNOWN_KEYS);

const SNAPSHOT_FIELDS = ['tree', 'highlightedNode', 'visited', 'pseudocodeLine', 'narration', 'sound'];
const VALID_SOUNDS = [null, ...Object.values(SOUNDS)];

// Small seeded PRNG (mulberry32) so the random tests are repeatable.
function rng(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function randomKeys(rand, n) {
  return Array.from({ length: n }, () => Math.floor(rand() * 200) - 50);
}
const sortedUnique = (keys) => [...new Set(keys)].sort((a, b) => a - b);

// Checks the BST property directly from the tree, independent of the traversals.
function isBST(node, lo = -Infinity, hi = Infinity) {
  if (node === null) return true;
  return node.key > lo && node.key < hi && isBST(node.left, lo, node.key) && isBST(node.right, node.key, hi);
}

function expectWellFormed(steps, pseudocode) {
  expect(steps.length).toBeGreaterThan(0);
  steps.forEach((s, i) => {
    expect(Object.keys(s).sort()).toEqual([...SNAPSHOT_FIELDS].sort());
    expect(Object.isFrozen(s)).toBe(true);
    expect(Array.isArray(s.visited)).toBe(true);
    expect(Number.isInteger(s.pseudocodeLine)).toBe(true);
    expect(s.pseudocodeLine).toBeGreaterThanOrEqual(0);
    expect(s.pseudocodeLine).toBeLessThan(pseudocode.length);
    expect(typeof s.narration).toBe('string');
    expect(s.narration.length).toBeGreaterThan(0);
    expect(VALID_SOUNDS).toContain(s.sound);
    if (i > 0) {
      // visited only ever grows: each step extends the previous one
      const prev = steps[i - 1].visited;
      expect(s.visited.length).toBeGreaterThanOrEqual(prev.length);
      expect(s.visited.slice(0, prev.length)).toEqual(prev);
    }
  });
}

describe('insert', () => {
  it('makes the first key the root of an empty tree', () => {
    const steps = insert(null, 50);
    const tree = steps.at(-1).tree;
    expect(tree).toEqual({ key: 50, left: null, right: null });
    expect(steps.at(-1).sound).toBe(SOUNDS.INSERT);
    expect(steps.at(-1).narration).toMatch(/root/);
  });

  it('follows the comparison path and places the key in the right spot', () => {
    const steps = insert(known(), 45);
    expect(steps.map((s) => s.highlightedNode)).toEqual([50, 50, 30, 40, 45]);
    expect(steps.map((s) => s.sound)).toEqual([
      null,
      SOUNDS.GO_LEFT,
      SOUNDS.GO_RIGHT,
      SOUNDS.GO_RIGHT,
      SOUNDS.INSERT,
    ]);
    expect(steps.map((s) => s.pseudocodeLine)).toEqual([0, 3, 4, 4, 1]);
    expect(steps.at(-1).visited).toEqual([50, 30, 40, 45]);
    expect(steps.at(-1).narration).toMatch(/right child of 40/);

    const tree = steps.at(-1).tree;
    expect(tree.left.right.right.key).toBe(45);
    expect(isBST(tree)).toBe(true);
  });

  it('shows the old tree on every step before the new node is placed', () => {
    const before = known();
    const steps = insert(before, 45);
    steps.slice(0, -1).forEach((s) => expect(s.tree).toBe(before));
    expect(steps.at(-1).tree).not.toBe(before);
  });

  it('does not change the input tree and shares untouched subtrees', () => {
    const before = known();
    const after = insert(before, 45).at(-1).tree;
    expect(before.left.right.right).toBeNull();
    expect(size(before)).toBe(7);
    expect(size(after)).toBe(8);
    expect(after.right).toBe(before.right); // right subtree untouched, so shared
    expect(Object.isFrozen(after)).toBe(true);
  });

  it('ignores a duplicate key and returns the same tree', () => {
    const before = known();
    const steps = insert(before, 40);
    expect(steps.at(-1).tree).toBe(before);
    expect(steps.at(-1).pseudocodeLine).toBe(2);
    expect(steps.at(-1).narration).toMatch(/already in the tree/);
  });

  it('rejects non-numeric keys', () => {
    expect(() => insert(null, '5')).toThrow(TypeError);
    expect(() => insert(null, NaN)).toThrow(TypeError);
  });

  it('produces well-formed snapshots', () => {
    expectWellFormed(insert(null, 1), INSERT_PSEUDOCODE);
    expectWellFormed(insert(known(), 45), INSERT_PSEUDOCODE);
    expectWellFormed(insert(known(), 50), INSERT_PSEUDOCODE);
  });
});

describe('search', () => {
  it('finds a key and reports the number of comparisons', () => {
    const steps = search(known(), 60);
    expect(steps.at(-1).sound).toBe(SOUNDS.FOUND);
    expect(steps.at(-1).highlightedNode).toBe(60);
    expect(steps.at(-1).visited).toEqual([50, 70, 60]);
    expect(steps.at(-1).narration).toMatch(/3 comparison/);
  });

  it('finds the root in one comparison', () => {
    const steps = search(known(), 50);
    expect(steps.at(-1).sound).toBe(SOUNDS.FOUND);
    expect(steps.at(-1).visited).toEqual([50]);
  });

  it('reports a missing key after reaching an empty spot', () => {
    const steps = search(known(), 65);
    expect(steps.at(-1).sound).toBe(SOUNDS.NOT_FOUND);
    expect(steps.at(-1).highlightedNode).toBeNull();
    expect(steps.at(-1).pseudocodeLine).toBe(1);
    expect(steps.at(-1).visited).toEqual([50, 70, 60]);
  });

  it('handles an empty tree', () => {
    const steps = search(null, 5);
    expect(steps.at(-1).sound).toBe(SOUNDS.NOT_FOUND);
    expect(steps.at(-1).visited).toEqual([]);
  });

  it('never changes the tree', () => {
    const tree = known();
    search(tree, 65).forEach((s) => expect(s.tree).toBe(tree));
  });

  it('produces well-formed snapshots', () => {
    expectWellFormed(search(known(), 60), SEARCH_PSEUDOCODE);
    expectWellFormed(search(known(), 65), SEARCH_PSEUDOCODE);
    expectWellFormed(search(null, 1), SEARCH_PSEUDOCODE);
  });
});

describe('depth-first traversals', () => {
  it('pre-order visits root, left subtree, right subtree', () => {
    expect(traversalOutput(known(), 'preorder')).toEqual([50, 30, 20, 40, 70, 60, 80]);
  });

  it('in-order visits left subtree, root, right subtree', () => {
    expect(traversalOutput(known(), 'inorder')).toEqual([20, 30, 40, 50, 60, 70, 80]);
  });

  it('post-order visits left subtree, right subtree, root', () => {
    expect(traversalOutput(known(), 'postorder')).toEqual([20, 40, 30, 60, 80, 70, 50]);
  });

  it('in-order output equals the sorted keys (known tree)', () => {
    expect(traversalOutput(known(), 'inorder')).toEqual(sortedUnique(KNOWN_KEYS));
  });

  it('in-order output equals the sorted keys (degenerate tree from sorted input)', () => {
    const keys = [1, 2, 3, 4, 5, 6, 7, 8];
    const tree = buildTree(keys);
    expect(height(tree)).toBe(keys.length); // one long chain
    expect(traversalOutput(tree, 'inorder')).toEqual(keys);
  });

  it('in-order output equals the sorted keys (50 seeded random trees, duplicates included)', () => {
    const rand = rng(212);
    for (let i = 0; i < 50; i++) {
      const keys = randomKeys(rand, 1 + Math.floor(rand() * 30));
      const tree = buildTree(keys);
      expect(isBST(tree)).toBe(true);
      expect(traversalOutput(tree, 'inorder')).toEqual(sortedUnique(keys));
    }
  });

  it('every order visits every node exactly once', () => {
    const tree = known();
    for (const order of ORDERS) {
      const out = traversalOutput(tree, order);
      expect(out).toHaveLength(size(tree));
      expect([...out].sort((a, b) => a - b)).toEqual(sortedUnique(KNOWN_KEYS));
    }
  });

  it('plays a visit sound exactly once per node, on the visit line', () => {
    const visitLine = { preorder: 2, inorder: 3, postorder: 4 };
    for (const order of ORDERS) {
      const visits = traverse(known(), order).filter((s) => s.sound === SOUNDS.VISIT);
      expect(visits).toHaveLength(7);
      visits.forEach((s) => expect(s.pseudocodeLine).toBe(visitLine[order]));
    }
  });

  it('returns a single snapshot for an empty tree', () => {
    for (const order of ORDERS) {
      const steps = traverse(null, order);
      expect(steps).toHaveLength(1);
      expect(steps[0].visited).toEqual([]);
      expect(steps[0].narration).toMatch(/empty/);
    }
  });

  it('works on a single node', () => {
    for (const order of ORDERS) {
      expect(traversalOutput(buildTree([9]), order)).toEqual([9]);
    }
  });

  it('rejects an unknown order', () => {
    expect(() => traverse(known(), 'levelorder')).toThrow(RangeError);
  });

  it('produces well-formed snapshots for every order', () => {
    for (const order of ORDERS) {
      expectWellFormed(traverse(known(), order), PSEUDOCODE[order]);
      expectWellFormed(traverse(buildTree([1, 2, 3]), order), PSEUDOCODE[order]);
      expectWellFormed(traverse(null, order), PSEUDOCODE[order]);
    }
  });
});

describe('tree helpers', () => {
  it('size and height', () => {
    expect(size(null)).toBe(0);
    expect(height(null)).toBe(0);
    expect(size(known())).toBe(7);
    expect(height(known())).toBe(3); // balanced: about log2(n) levels
  });
});
