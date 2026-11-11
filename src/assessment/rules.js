// Scaffolding rules from the ID document (section 4.7.3).
// Pure functions so they can be unit tested without React.

export const MAX_HINT_LEVEL = 3; // 3 = full step-by-step hint, 0 = no hint
export const CORRECT_IN_A_ROW_TO_FADE = 2;

/**
 * Hint level the quick quiz for `lessonId` starts at.
 * Every lesson already mastered before this one makes the starting hint one
 * level lighter ("hints in the next lesson start one level lighter"), but a
 * new lesson always starts with at least a nudge available.
 */
export function startingHintLevel(lessonId, masteredLessons = []) {
  const earlierMastered = masteredLessons.filter((id) => id < lessonId).length;
  return Math.max(1, MAX_HINT_LEVEL - earlierMastered);
}

/**
 * Hint level after one answer: it drops one level after two correct answers in
 * a row and goes up one level after a wrong answer.
 * @returns {{ hintLevel: number, correctStreak: number }}
 */
export function nextHintLevel({ hintLevel, correctStreak }, correct) {
  if (!correct) {
    return { hintLevel: Math.min(MAX_HINT_LEVEL, hintLevel + 1), correctStreak: 0 };
  }
  const streak = correctStreak + 1;
  if (streak >= CORRECT_IN_A_ROW_TO_FADE) {
    return { hintLevel: Math.max(0, hintLevel - 1), correctStreak: 0 };
  }
  return { hintLevel, correctStreak: streak };
}

/**
 * Routing rule: a passed quiz moves the student on; anything below the pass
 * mark goes to the worked example, hints and a retry with fresh questions.
 */
export function routeQuizResult(result) {
  return result.passed ? 'next-lesson' : 'scaffold';
}

/** Outcomes the student got wrong, in the order the questions were asked. */
export function missedOutcomes(questions, answers) {
  return [...new Set(
    questions
      .filter((question) => answers[question.id] !== question.correctAnswer)
      .map((question) => question.outcome),
  )];
}

/** Lessons that teach any of the given outcomes, in lesson order. */
export function lessonsForOutcomes(outcomes, lessons) {
  return lessons
    .filter((lesson) => lesson.outcomes.some((outcome) => outcomes.includes(outcome)))
    .map((lesson) => lesson.id);
}
