// Content integrity: the ID team edits these JSON files directly (NFR6), and the
// SE document lists wrong generated questions as a high-impact risk. These tests
// check the content files are complete and recompute answer keys with the engine.
import { describe, expect, it } from 'vitest';
import questions from '../src/content/questions.json';
import lessons from '../src/content/lessons.json';
import misconceptions from '../src/content/misconceptions.json';
import outcomes from '../src/content/outcomes.json';
import videos from '../src/content/videos.json';
import { quizDiagrams } from '../src/content/quizDiagrams.js';
import { QUICK_QUIZ_SIZE } from '../src/assessment/quiz.js';
import { buildTree, insert, isValidBST, search } from '../src/engine/bst.js';
import { traversalOutput } from '../src/engine/traversals.js';

const byId = Object.fromEntries(questions.map((question) => [question.id, question]));
const optionText = (id, option) => byId[id].options.find((item) => item.id === option).text;
const correctText = (id) => optionText(id, byId[id].correctAnswer);
const numbers = (text) => (text.match(/\d+/g) ?? []).map(Number);

describe('question bank', () => {
  it('has well-formed questions with a valid answer key', () => {
    for (const question of questions) {
      const ids = question.options.map((option) => option.id);
      expect(new Set(ids).size, question.id).toBe(ids.length);
      expect(ids, question.id).toContain(question.correctAnswer);
      expect(['Explain', 'Apply', 'Evaluate'], question.id).toContain(question.skillLevel);
    }
  });

  it('tags every wrong option with a defined misconception (FR11)', () => {
    for (const question of questions) {
      for (const option of question.options) {
        if (option.id === question.correctAnswer) {
          expect(option.misconception, `${question.id}${option.id}`).toBeUndefined();
        } else {
          expect(misconceptions[option.misconception], `${question.id}${option.id}`).toBeDefined();
        }
      }
    }
  });

  it('only uses outcomes that belong to the question’s lesson', () => {
    for (const question of questions) {
      const lesson = lessons.find((item) => item.id === question.lesson);
      expect(lesson.outcomes, question.id).toContain(question.outcome);
    }
  });

  it('has enough selectable questions for a quick quiz in every lesson', () => {
    for (const lesson of lessons) {
      const pool = questions.filter((question) => question.lesson === lesson.id && question.selectable !== false);
      expect(pool.length, `lesson ${lesson.id}`).toBeGreaterThanOrEqual(QUICK_QUIZ_SIZE);
    }
  });

  it('covers every learning outcome so the mastery check can ask one per outcome', () => {
    for (const outcome of Object.keys(outcomes)) {
      expect(questions.some((question) => question.outcome === outcome && question.selectable !== false), outcome).toBe(true);
    }
  });
});

describe('diagrams match their questions and lessons', () => {
  it('draws a non-BST wherever the question says the tree is not a valid BST', () => {
    expect(isValidBST(quizDiagrams.Q4)).toBe(false); // answer: 12 is in 10's left subtree
    expect(quizDiagrams.Q4.left.right.key).toBe(12);
    expect(isValidBST(quizDiagrams.Q18)).toBe(false);
  });

  it('draws valid BSTs everywhere else', () => {
    for (const [id, tree] of Object.entries(quizDiagrams)) {
      if (id === 'Q4' || id === 'Q18') continue;
      expect(isValidBST(tree), id).toBe(true);
    }
  });

  it('draws an invalid tree for every lesson caption that says "not a BST"', () => {
    for (const lesson of lessons) {
      for (const section of lesson.sections) {
        if (!/not a BST/i.test(section.caption ?? '')) continue;
        const tree = section.tree ?? buildTree(section.keys);
        expect(isValidBST(tree), `lesson ${lesson.id}: ${section.heading}`).toBe(false);
      }
    }
  });
});

describe('answer keys recomputed with the BST engine', () => {
  it.each([
    ['Q14', 'inorder'],
    ['Q15', 'preorder'],
    ['Q16', 'postorder'],
  ])('%s: the correct option is the %s output', (id, order) => {
    expect(numbers(correctText(id))).toEqual(traversalOutput(quizDiagrams[id], order));
  });

  it('Q18: in-order of the non-BST diagram matches the correct option', () => {
    expect(numbers(correctText('Q18')).slice(0, 3)).toEqual(traversalOutput(quizDiagrams.Q18, 'inorder'));
  });

  it('Q6: the search path for 60 matches the correct option', () => {
    expect(numbers(correctText('Q6'))).toEqual(search(quizDiagrams.Q6, 60).at(-1).visited);
  });

  it('Q7: searching 45 is not found after 50, 30, 40', () => {
    const last = search(quizDiagrams.Q7, 45).at(-1);
    expect(last.sound).toBe('not-found');
    expect(numbers(correctText('Q7'))).toEqual(last.visited);
  });

  it('Q8: finding 20 takes the number of comparisons in the correct option', () => {
    expect(numbers(correctText('Q8'))[0]).toBe(search(quizDiagrams.Q8, 20).at(-1).visited.length);
  });

  it.each([
    ['Q9', 35, 'left child of 40'],
    ['Q10', 65, 'right child of 60'],
  ])('%s: inserting %i lands as the %s', (id, key, place) => {
    expect(insert(quizDiagrams[id], key).at(-1).narration).toContain(place);
    expect(correctText(id)).toContain(place);
  });

  it('Q11 and Q12: built trees match the correct options', () => {
    expect(buildTree([15, 8, 20, 12]).left.right.key).toBe(12);
    expect(buildTree([25, 10, 30, 5, 15]).left.right.key).toBe(Number(correctText('Q12')));
  });
});

describe('other content files', () => {
  it('has a video for every lesson', () => {
    for (const lesson of lessons) expect(videos[String(lesson.id)]?.id, `lesson ${lesson.id}`).toBeTruthy();
  });

  it('only lists outcomes that are defined', () => {
    for (const lesson of lessons) {
      for (const outcome of lesson.outcomes) expect(outcomes[outcome], outcome).toBeDefined();
    }
  });
});
