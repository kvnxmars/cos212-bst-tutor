import { describe, expect, it } from 'vitest';
import { CHALLENGE_KEYS, CHALLENGE_SLOTS, getPlacementFeedback } from '../src/engine/treeChallenge.js';

describe('BST tree-building challenge', () => {
  it('provides seven unique nodes and positions', () => {
    expect(new Set(CHALLENGE_KEYS).size).toBe(7);
    expect(new Set(CHALLENGE_SLOTS.map((slot) => slot.id)).size).toBe(7);
  });

  it('accepts a correct placement and explains the relationship', () => {
    const feedback = getPlacementFeedback(20, CHALLENGE_SLOTS.find((slot) => slot.id === 'left-left'));

    expect(feedback.correct).toBe(true);
    expect(feedback.message).toContain('20 is less than 30');
    expect(feedback.message).toContain('left subtree of 50');
  });

  it('guides a misplaced node through its comparisons from the root', () => {
    const feedback = getPlacementFeedback(40, CHALLENGE_SLOTS.find((slot) => slot.id === 'root'));

    expect(feedback.correct).toBe(false);
    expect(feedback.message).toContain('40 < 50');
    expect(feedback.message).toContain('40 > 30');
    expect(feedback.message).toContain('right child of 30');
  });

  it('guides the root to its designated position', () => {
    const feedback = getPlacementFeedback(50, CHALLENGE_SLOTS.find((slot) => slot.id === 'left'));

    expect(feedback.correct).toBe(false);
    expect(feedback.message).toContain('50 belongs in the root');
  });
});
