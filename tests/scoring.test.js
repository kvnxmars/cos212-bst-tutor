import { describe, expect, it } from 'vitest';
import { misconceptionFor, misconceptionsCsv } from '../src/assessment/scoring.js';

const question = {
  id: 'Q9',
  correctAnswer: 'B',
  options: [
    { id: 'A', text: 'x', misconception: 'insert-moves-nodes' },
    { id: 'B', text: 'y' },
    { id: 'C', text: 'z' },
  ],
};

describe('misconception tagging', () => {
  it('returns the tag of a wrong option and nothing for the right one', () => {
    expect(misconceptionFor(question, 'A')).toBe('insert-moves-nodes');
    expect(misconceptionFor(question, 'B')).toBeNull();
    expect(misconceptionFor(question, 'C')).toBeNull();
  });
});

describe('misconception CSV (FR22)', () => {
  const misconceptions = {
    'insert-moves-nodes': { label: 'Thinking an insert moves existing nodes', feedback: 'Existing nodes never move, "ever".' },
  };

  it('has a header row and one row per hit, matching the recorded misconceptions', () => {
    const csv = misconceptionsCsv([
      { date: '2026-11-11', lessonId: 2, questionId: 'Q9', tag: 'insert-moves-nodes' },
      { date: '2026-11-11', lessonId: 'mastery', questionId: 'Q9', tag: 'insert-moves-nodes' },
    ], misconceptions);
    const lines = csv.split('\n');
    expect(lines[0]).toBe('date,lesson,question,misconception,feedback');
    expect(lines).toHaveLength(3);
    expect(lines[1]).toContain('Lesson 2,Q9,Thinking an insert moves existing nodes');
    expect(lines[2]).toContain('Mastery check');
  });

  it('quotes cells that contain commas or quotes', () => {
    const csv = misconceptionsCsv([{ date: 'd', lessonId: 1, questionId: 'Q1', tag: 'insert-moves-nodes' }], misconceptions);
    expect(csv).toContain('"Existing nodes never move, ""ever""."');
  });
});
