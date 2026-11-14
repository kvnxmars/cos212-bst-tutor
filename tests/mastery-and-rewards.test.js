import { describe, expect, it } from 'vitest';
import questions from '../src/content/questions.json';
import rewards from '../src/content/rewards.json';
import {
  MASTERY_OUTCOMES,
  scoreMasteryCheck,
  selectMasteryQuestions,
} from '../src/assessment/quiz.js';
import { resumeLocation } from '../src/assessment/progress.js';
import { activeBannerIdFor, awardLessonBanner, bannerIdFor, isRewardEarned } from '../src/assessment/rewards.js';

describe('final mastery check (ID document 4.7.4)', () => {
  it('asks 10 questions, one per outcome, with no repeats', () => {
    const selected = selectMasteryQuestions(questions, { random: () => 0 });
    expect(selected).toHaveLength(10);
    expect(selected.map((question) => question.outcome)).toEqual([...MASTERY_OUTCOMES]);
    expect(new Set(selected.map((question) => question.id)).size).toBe(10);
  });

  it('uses fresh questions on a retake when the pool allows it', () => {
    const first = selectMasteryQuestions(questions, { random: () => 0 });
    const retake = selectMasteryQuestions(questions, { previousQuestionIds: first.map((q) => q.id), random: () => 0 });
    const repeated = retake.filter((question) => first.some((old) => old.id === question.id));
    // Every outcome has at least two questions in the pool, so nothing repeats.
    expect(repeated).toEqual([]);
  });

  it('passes at 8 of 10 and fails at 7 of 10', () => {
    const selected = selectMasteryQuestions(questions, { random: () => 0 });
    const answersWithWrong = (wrong) => Object.fromEntries(selected.map((question, index) => [
      question.id,
      index < wrong ? question.options.find((option) => option.id !== question.correctAnswer).id : question.correctAnswer,
    ]));
    expect(scoreMasteryCheck(selected, answersWithWrong(2)).passed).toBe(true);
    expect(scoreMasteryCheck(selected, answersWithWrong(3)).passed).toBe(false);
  });
});

describe('rewards', () => {
  it('defines one banner per lesson and one wallpaper in the content file', () => {
    expect(rewards.filter((reward) => reward.type === 'banner').map((reward) => reward.id))
      .toEqual([1, 2, 3, 4].map(bannerIdFor));
    expect(rewards.filter((reward) => reward.type === 'wallpaper')).toHaveLength(1);
  });

  it('unlocks the wallpaper only after the mastery check is passed', () => {
    const wallpaper = rewards.find((reward) => reward.type === 'wallpaper');
    const state = (passed) => ({ earnedBanners: ['lesson-1', 'lesson-2', 'lesson-3', 'lesson-4'], masteryCheck: { passed } });
    expect(isRewardEarned(wallpaper, state(false))).toBe(false);
    expect(isRewardEarned(wallpaper, state(true))).toBe(true);
  });

  it('never removes a banner already earned', () => {
    const earned = awardLessonBanner(['lesson-1'], 2);
    expect(earned).toEqual(['lesson-1', 'lesson-2']);
    expect(awardLessonBanner(earned, 1)).toBe(earned);
  });

  it('uses the selected earned banner, otherwise the most recently earned banner', () => {
    expect(activeBannerIdFor({ earnedBanners: [], selectedBanner: null })).toBe(null);
    expect(activeBannerIdFor({ earnedBanners: ['lesson-1'], selectedBanner: 'default' })).toBe(null);
    expect(activeBannerIdFor({ earnedBanners: ['lesson-1', 'lesson-2'], selectedBanner: null })).toBe('lesson-2');
    expect(activeBannerIdFor({ earnedBanners: ['lesson-1', 'lesson-2'], selectedBanner: 'lesson-1' })).toBe('lesson-1');
    expect(activeBannerIdFor({ earnedBanners: ['lesson-1'], selectedBanner: 'lesson-4' })).toBe('lesson-1');
  });
});

describe('resume (SE document 4.6)', () => {
  it('sends a new student to Lesson 1 and a returning student to their first unmastered lesson', () => {
    expect(resumeLocation([])).toBe('#lesson?lesson=1');
    expect(resumeLocation([1, 2])).toBe('#lesson?lesson=3');
    expect(resumeLocation([1, 2, 3, 4])).toBe('#mastery');
  });
});
