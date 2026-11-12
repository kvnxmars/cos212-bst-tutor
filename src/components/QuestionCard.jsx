import TreeView from './TreeView.jsx';

export default function QuestionCard({ question, tree, selectedAnswer, submitted = selectedAnswer !== undefined, onAnswer }) {
  return (
    <section className="quiz-question-card" aria-labelledby={`question-${question.id}`}>
      {tree && (
        <figure className="quiz-tree">
          <TreeView tree={tree} snapshot={null} />
          <figcaption>Tree for this question</figcaption>
        </figure>
      )}
      <fieldset className="quiz-answer-options" disabled={submitted}>
        <legend className="visually-hidden">Answer options</legend>
        {question.options.map((option) => (
          <label
            className={`quiz-answer-option${selectedAnswer === option.id ? ' is-selected' : ''}`}
            key={option.id}
          >
            <input
              type="radio"
              name={`answer-${question.id}`}
              value={option.id}
              checked={selectedAnswer === option.id}
              onChange={() => onAnswer(option.id)}
            />
            <span className="answer-letter">{option.id}.</span>
            <span>{option.text}</span>
          </label>
        ))}
      </fieldset>
    </section>
  );
}
