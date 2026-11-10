import { describe, expect, it } from 'vitest';
import videos from '../src/content/videos.json';
import {
  analyzeInsertionOrder,
  getSearchInsertionFeedback,
  getTraversalStepFeedback,
  SEARCH_INSERTION_CHALLENGE,
  TRAVERSAL_CHALLENGE_KEYS,
} from '../src/engine/learningChallenges.js';
import { traversalOutput } from '../src/engine/traversals.js';
import { buildTree } from '../src/engine/bst.js';

describe('lesson-specific learning challenges', () => {
  it('provides a distinct video for each lesson', () => {
    const lessonVideos = Object.values(videos);

    expect(lessonVideos).toHaveLength(4);
    expect(new Set(lessonVideos.map((video) => video.id)).size).toBe(4);
    expect(lessonVideos.every((video) => video.title && video.focus)).toBe(true);
  });

  it('teaches the path for searching and inserting a missing key', () => {
    expect(SEARCH_INSERTION_CHALLENGE.values).toEqual([50, 70, 60, 65]);
    expect(getSearchInsertionFeedback(70, 1).correct).toBe(true);
    expect(getSearchInsertionFeedback(30, 1).message).toContain('Go left');
    expect(getSearchInsertionFeedback(65, 3).message).toContain('empty right link of 60');
  });

  it('uses the traversal engine for expected visits and helpful next-step cues', () => {
    const output = traversalOutput(buildTree(TRAVERSAL_CHALLENGE_KEYS), 'inorder');

    expect(output).toEqual([20, 30, 40, 50, 60, 70, 80]);
    expect(getTraversalStepFeedback('preorder', 50, 0).correct).toBe(true);
    expect(getTraversalStepFeedback('inorder', 50, 0).message).toContain('20 comes next');
    expect(getTraversalStepFeedback('postorder', 50, 6).message).toContain('visits the root only after both subtrees are complete');
  });

  it('compares sorted and balanced insertion orders by height and successful search cost', () => {
    const chain = analyzeInsertionOrder([1, 2, 3, 4, 5]);
    const shallow = analyzeInsertionOrder([3, 1, 5, 2, 4]);

    expect(chain).toMatchObject({ height: 5, averageSearchComparisons: 3, isShallow: false });
    expect(shallow).toMatchObject({ height: 3, averageSearchComparisons: 2.2, isShallow: true });
  });
});
