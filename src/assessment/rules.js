// Scaffolding rules from the ID document (section 4.7.3).
// Pure functions so they can be unit tested without React.

export const HINTS_PER_LESSON = 3;

export function consumeHint(hintsUsed) {
  return Math.min(HINTS_PER_LESSON, hintsUsed + 1);
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
