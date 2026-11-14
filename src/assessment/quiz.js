export const QUICK_QUIZ_SIZE = 4;
export const QUICK_QUIZ_PASS_MARK = 0.75;

function chooseRandom(items, random) {
  return items[Math.floor(random() * items.length)];
}

export function selectQuizQuestions(
  questionBank,
  lessonId,
  { previousQuestionIds = [], count = QUICK_QUIZ_SIZE, random = Math.random } = {},
) {
  const pool = questionBank.filter((question) => question.lesson === lessonId && question.selectable !== false);
  if (pool.length < count) {
    throw new Error(`Lesson ${lessonId} has only ${pool.length} selectable questions; ${count} are required.`);
  }

  const previous = new Set(previousQuestionIds);
  const selected = [];
  const selectedIds = new Set();
  const available = (questions) => {
    const fresh = questions.filter((question) => !previous.has(question.id) && !selectedIds.has(question.id));
    return fresh.length ? fresh : questions.filter((question) => !selectedIds.has(question.id));
  };
  const outcomes = [...new Set(pool.map((question) => question.outcome))];

  for (const outcome of outcomes) {
    const candidates = available(pool.filter((question) => question.outcome === outcome));
    if (candidates.length && selected.length < count) {
      const question = chooseRandom(candidates, random);
      selected.push(question);
      selectedIds.add(question.id);
    }
  }

  while (selected.length < count) {
    const candidates = available(pool);
    if (!candidates.length) break;
    const question = chooseRandom(candidates, random);
    selected.push(question);
    selectedIds.add(question.id);
  }

  return selected;
}

export function scoreQuiz(questions, answers) {
  const correctCount = questions.reduce(
    (total, question) => total + (answers[question.id] === question.correctAnswer ? 1 : 0),
    0,
  );
  const total = questions.length;

  return {
    correctCount,
    total,
    percentage: total ? Math.round((correctCount / total) * 100) : 0,
    passed: total > 0 && correctCount / total >= QUICK_QUIZ_PASS_MARK,
  };
}

// Final mastery check (ID document 4.7.4): one question per outcome, 8 of 10 to pass.
export const MASTERY_OUTCOMES = Object.freeze(['O1', 'O2', 'O3', 'O4', 'O5', 'O6', 'O7', 'O8', 'O9', 'O10']);
export const MASTERY_PASS_COUNT = 8;

export function selectMasteryQuestions(
  questionBank,
  { previousQuestionIds = [], random = Math.random } = {},
) {
  const previous = new Set(previousQuestionIds);
  return MASTERY_OUTCOMES.map((outcome) => {
    const pool = questionBank.filter((question) => question.outcome === outcome && question.selectable !== false);
    if (!pool.length) throw new Error(`No selectable question covers outcome ${outcome}.`);
    const fresh = pool.filter((question) => !previous.has(question.id));
    return chooseRandom(fresh.length ? fresh : pool, random);
  });
}

export function scoreMasteryCheck(questions, answers) {
  const result = scoreQuiz(questions, answers);
  return { ...result, passed: result.correctCount >= MASTERY_PASS_COUNT };
}
