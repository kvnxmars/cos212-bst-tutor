import { describe, expect, it } from 'vitest';
import { scoreQuiz } from '../src/assessment/quiz.js';
import {
  lessonsForOutcomes,
  missedOutcomes,
  HINTS_PER_LESSON,
  consumeHint,
  routeQuizResult,
} from '../src/assessment/rules.js';

const fourQuestions = ['a', 'b', 'c', 'd'].map((id, index) => ({ id, outcome: `O${index + 1}`, correctAnswer: 'A' }));

describe('routing rule (ID document 4.7.3)', () => {
  it('passes at 3 of 4 (75%) and routes 2 of 4 to the scaffold', () => {
    const pass = scoreQuiz(fourQuestions, { a: 'A', b: 'A', c: 'A', d: 'B' });
    const fail = scoreQuiz(fourQuestions, { a: 'A', b: 'A', c: 'B', d: 'B' });
    expect(routeQuizResult(pass)).toBe('next-lesson');
    expect(routeQuizResult(fail)).toBe('scaffold');
  });

  it('lists the missed outcomes and the lessons that teach them', () => {
    const missed = missedOutcomes(fourQuestions, { a: 'A', b: 'B', c: 'A', d: 'C' });
    expect(missed).toEqual(['O2', 'O4']);
    const lessons = [
      { id: 1, outcomes: ['O1', 'O2'] },
      { id: 2, outcomes: ['O3', 'O4'] },
      { id: 3, outcomes: ['O6'] },
    ];
    expect(lessonsForOutcomes(missed, lessons)).toEqual([1, 2]);
  });
});

describe('lesson hint budget', () => {
  it('provides exactly three hints per quiz round', () => {
    expect(HINTS_PER_LESSON).toBe(3);
  });

  it('uses one hint per request and never increases the available budget past three', () => {
    expect(consumeHint(0)).toBe(1);
    expect(consumeHint(1)).toBe(2);
    expect(consumeHint(2)).toBe(3);
    expect(consumeHint(3)).toBe(3);
  });
});
