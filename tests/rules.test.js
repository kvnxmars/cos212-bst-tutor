import { describe, expect, it } from 'vitest';
import { scoreQuiz } from '../src/assessment/quiz.js';
import {
  lessonsForOutcomes,
  missedOutcomes,
  nextHintLevel,
  routeQuizResult,
  startingHintLevel,
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

describe('hint fading', () => {
  it('drops one level after two correct answers in a row', () => {
    let state = { hintLevel: 3, correctStreak: 0 };
    state = nextHintLevel(state, true);
    expect(state.hintLevel).toBe(3);
    state = nextHintLevel(state, true);
    expect(state.hintLevel).toBe(2);
  });

  it('goes up one level after a wrong answer and resets the streak', () => {
    const state = nextHintLevel({ hintLevel: 1, correctStreak: 1 }, false);
    expect(state).toEqual({ hintLevel: 2, correctStreak: 0 });
  });

  it('never goes below 0 (no hint) or above 3 (full hint)', () => {
    expect(nextHintLevel({ hintLevel: 0, correctStreak: 1 }, true).hintLevel).toBe(0);
    expect(nextHintLevel({ hintLevel: 3, correctStreak: 0 }, false).hintLevel).toBe(3);
  });

  it('starts each new lesson one level lighter than the last, but always with a hint', () => {
    expect(startingHintLevel(1, [])).toBe(3);
    expect(startingHintLevel(2, [1])).toBe(2);
    expect(startingHintLevel(3, [1, 2])).toBe(1);
    expect(startingHintLevel(4, [1, 2, 3])).toBe(1);
  });
});
