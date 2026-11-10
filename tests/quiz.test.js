import { describe, expect, it } from 'vitest';
import { scoreQuiz, selectQuizQuestions } from '../src/assessment/quiz.js';
import { isLessonUnlocked } from '../src/assessment/progress.js';

const question = (id, outcome, lesson = 1) => ({
  id,
  lesson,
  outcome,
  correctAnswer: 'A',
});

describe('quiz selection', () => {
  const bank = [
    question('Q1', 'O1'),
    question('Q2', 'O1'),
    question('Q3', 'O2'),
    question('Q4', 'O2'),
    question('Q5', 'O2'),
    question('Q6', 'O3', 2),
  ];

  it('selects four questions and covers every outcome in the lesson', () => {
    const selected = selectQuizQuestions(bank, 1, { random: () => 0 });

    expect(selected).toHaveLength(4);
    expect(new Set(selected.map((item) => item.outcome))).toEqual(new Set(['O1', 'O2']));
  });

  describe('lesson progression', () => {
    it('unlocks Lesson 1 without progress and later lessons only after passing the previous quiz', () => {
      expect(isLessonUnlocked(1, [])).toBe(true);
      expect(isLessonUnlocked(2, [])).toBe(false);
      expect(isLessonUnlocked(2, [1])).toBe(true);
      expect(isLessonUnlocked(3, [1])).toBe(false);
      expect(isLessonUnlocked(3, [1, 2])).toBe(true);
    });
  });

  it('uses the remaining fresh question when a full fresh retry is impossible', () => {
    const selected = selectQuizQuestions(bank, 1, {
      previousQuestionIds: ['Q1', 'Q3', 'Q4', 'Q5'],
      random: () => 0,
    });

    expect(selected.map((item) => item.id)).toContain('Q2');
    expect(selected).toHaveLength(4);
  });

  it('scores three out of four as a pass', () => {
    const questions = [question('Q1', 'O1'), question('Q2', 'O1'), question('Q3', 'O2'), question('Q4', 'O2')];
    const result = scoreQuiz(questions, { Q1: 'A', Q2: 'A', Q3: 'B', Q4: 'A' });

    expect(result).toEqual({ correctCount: 3, total: 4, percentage: 75, passed: true });
  });
});
