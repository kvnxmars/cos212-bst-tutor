// The example test cases from the SE document (section 5), one test each, so the
// document's test table and the code stay traceable to each other.
import { describe, expect, it } from 'vitest';
import { buildTree, height, insert, isValidBST, search } from '../src/engine/bst.js';
import { traversalOutput, traverse } from '../src/engine/traversals.js';
import { scoreQuiz } from '../src/assessment/quiz.js';
import { routeQuizResult } from '../src/assessment/rules.js';
import { isLessonUnlocked } from '../src/assessment/progress.js';
import { awardLessonBanner, isRewardEarned } from '../src/assessment/rewards.js';

const finalTree = (steps) => steps.at(-1).tree;

describe('SE document section 5: BST example test cases', () => {
  it('Basic insert: 5, 3, 8 into an empty tree gives root 5, left 3, right 8', () => {
    const tree = buildTree([5, 3, 8]);
    expect(tree.key).toBe(5);
    expect(tree.left.key).toBe(3);
    expect(tree.right.key).toBe(8);
  });

  it('Stick-shaped tree: inserting 1..5 makes every node a right child, height 5', () => {
    const tree = buildTree([1, 2, 3, 4, 5]);
    expect(height(tree)).toBe(5);
    let node = tree;
    while (node) {
      expect(node.left).toBeNull();
      node = node.right;
    }
  });

  it('Search, found: 3 in the tree 5, 3, 8 is found via 5 then 3', () => {
    const steps = search(buildTree([5, 3, 8]), 3);
    expect(steps.at(-1).sound).toBe('found');
    expect(steps.at(-1).visited).toEqual([5, 3]);
  });

  it('Search, not found: 7 in the tree 5, 3, 8 goes 5 then 8, then an empty left child', () => {
    const steps = search(buildTree([5, 3, 8]), 7);
    expect(steps.at(-1).sound).toBe('not-found');
    expect(steps.at(-1).visited).toEqual([5, 8]);
    expect(steps.at(-2).narration).toMatch(/go left/);
  });

  it('In-order of the tree 5, 3, 8 is 3, 5, 8 (ascending)', () => {
    expect(traversalOutput(buildTree([5, 3, 8]), 'inorder')).toEqual([3, 5, 8]);
  });

  it('Pre-order is 5, 3, 8 and post-order is 3, 8, 5', () => {
    const tree = buildTree([5, 3, 8]);
    expect(traversalOutput(tree, 'preorder')).toEqual([5, 3, 8]);
    expect(traversalOutput(tree, 'postorder')).toEqual([3, 8, 5]);
  });

  it('Empty tree: search and traversals return an empty result without errors', () => {
    expect(() => search(null, 4)).not.toThrow();
    expect(search(null, 4).at(-1).sound).toBe('not-found');
    for (const order of ['preorder', 'inorder', 'postorder']) {
      expect(traversalOutput(null, order)).toEqual([]);
      expect(traverse(null, order).length).toBeGreaterThan(0);
    }
  });

  it('Duplicate key: inserting 5 twice is ignored and the explanation says so', () => {
    const tree = buildTree([5]);
    const steps = insert(tree, 5);
    expect(finalTree(steps)).toBe(tree);
    expect(steps.at(-1).narration).toMatch(/already in the tree/);
  });

  it('Routing rule: a score below the pass mark goes to scaffolding and keeps the next lesson locked', () => {
    const questions = ['a', 'b', 'c', 'd'].map((id) => ({ id, correctAnswer: 'A' }));
    const result = scoreQuiz(questions, { a: 'A', b: 'A', c: 'B', d: 'B' });
    expect(result.passed).toBe(false);
    expect(routeQuizResult(result)).toBe('scaffold');
    expect(isLessonUnlocked(2, [])).toBe(false);
  });

  it('Reward rules: passing Lesson 1 twice awards its banner once; the wallpaper stays locked', () => {
    const once = awardLessonBanner([], 1);
    const twice = awardLessonBanner(once, 1);
    expect(twice).toEqual(['lesson-1']);
    const state = { earnedBanners: twice, masteryCheck: { passed: false } };
    expect(isRewardEarned({ id: 'mastery-wallpaper', type: 'wallpaper' }, state)).toBe(false);
  });
});

describe('isValidBST', () => {
  it('accepts every tree built by insertion', () => {
    expect(isValidBST(buildTree([50, 30, 70, 20, 40, 60, 80]))).toBe(true);
    expect(isValidBST(null)).toBe(true);
  });

  it('rejects a deeper violation that a parent-only check would miss', () => {
    const tree = {
      key: 50,
      left: { key: 30, left: null, right: { key: 60, left: null, right: null } },
      right: null,
    };
    expect(isValidBST(tree)).toBe(false);
  });
});
