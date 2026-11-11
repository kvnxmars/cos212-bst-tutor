// Misconception records and the optional CSV summary (FR22).

/** Misconception tag of the chosen option, or null if the answer was right or untagged. */
export function misconceptionFor(question, optionId) {
  if (optionId === question.correctAnswer) return null;
  return question.options.find((option) => option.id === optionId)?.misconception ?? null;
}

function csvCell(value) {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

/**
 * One row per misconception hit: date, lesson, question, misconception and
 * the targeted feedback, so a lecturer can see what to address in class.
 */
export function misconceptionsCsv(hits, misconceptions) {
  const header = ['date', 'lesson', 'question', 'misconception', 'feedback'];
  const rows = hits.map((hit) => [
    hit.date,
    hit.lessonId === 'mastery' ? 'Mastery check' : `Lesson ${hit.lessonId}`,
    hit.questionId,
    misconceptions[hit.tag]?.label ?? hit.tag,
    misconceptions[hit.tag]?.feedback ?? '',
  ]);
  return [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\n');
}
