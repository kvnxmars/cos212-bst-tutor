import misconceptions from '../content/misconceptions.json';
import { misconceptionFor } from '../assessment/scoring.js';

// Feedback after one answer (FR11): the explanation, plus targeted feedback for
// the misconception a wrong option is tagged with.
export default function AnswerFeedback({ question, selectedAnswer }) {
  const correct = selectedAnswer === question.correctAnswer;
  const tag = misconceptionFor(question, selectedAnswer);
  const misconception = tag ? misconceptions[tag] : null;

  return (
    <div className={`quiz-feedback${correct ? ' is-correct' : ' is-incorrect'}`} role="status">
      <strong>{correct ? 'Correct.' : 'Not quite.'}</strong>
      {misconception && (
        <p className="misconception-feedback">
          <span>Common mix-up: {misconception.label}.</span> {misconception.feedback}
        </p>
      )}
      <p>{question.explanation}</p>
    </div>
  );
}
