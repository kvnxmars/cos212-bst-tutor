import { useState } from 'react';

export default function DragSequenceChallenge({
  items,
  slotLabels,
  instruction,
  getFeedback,
  onComplete,
  onAttempt,
  onReset,
  acceptAnyOrder = false,
  evaluate,
  resetKey = 'challenge',
}) {
  const [placements, setPlacements] = useState(() => slotLabels.map(() => null));
  const [selectedItem, setSelectedItem] = useState(null);
  const [message, setMessage] = useState(instruction);
  const [feedbackKind, setFeedbackKind] = useState('guide');
  const [complete, setComplete] = useState(false);
  const [completionSummary, setCompletionSummary] = useState('');
  const placed = placements.filter((item) => item !== null);
  const availableItems = items.filter((item) => !placed.includes(item));

  function placeItem(slotIndex, item = selectedItem) {
    if (item === null || item === undefined) {
      setMessage('Select a tile first, then choose an empty step.');
      setFeedbackKind('guide');
      return;
    }
    if (!items.includes(item)) {
      setMessage('That tile is not part of this challenge. Choose one from the tray.');
      setFeedbackKind('incorrect');
      return;
    }
    if (placements[slotIndex] !== null) {
      setMessage('That step is already filled. Choose its tile to return it to the tray.');
      setFeedbackKind('guide');
      return;
    }

    if (!acceptAnyOrder) {
      const feedback = getFeedback(item, slotIndex);
      setMessage(feedback.message);
      setFeedbackKind(feedback.correct ? 'correct' : 'incorrect');
      if (!feedback.correct) return;
    }

    const next = [...placements];
    next[slotIndex] = item;
    setPlacements(next);
    setSelectedItem(null);

    if (next.every((value) => value !== null)) {
      onAttempt?.(next);
      const lastStepFeedback = getFeedback?.(item, slotIndex);
      const result = evaluate
        ? evaluate(next)
        : { correct: true, message: lastStepFeedback?.message ?? 'Challenge complete.' };
      setMessage(result.message);
      setFeedbackKind(result.correct ? 'correct' : 'incorrect');
      if (result.correct) {
        setComplete(true);
        setCompletionSummary(result.summary ?? result.message);
        onComplete?.(next, result);
      }
    }
  }

  function chooseItem(item) {
    const deselecting = selectedItem === item;
    setSelectedItem(deselecting ? null : item);
    setMessage(deselecting
      ? `${item} deselected. Select a tile and then a step.`
      : `${item} selected. Drag it to a step, or choose an empty step.`);
    setFeedbackKind('guide');
  }

  function removeItem(slotIndex) {
    if (complete) return;
    const item = placements[slotIndex];
    if (item === null) {
      placeItem(slotIndex);
      return;
    }
    const next = [...placements];
    next[slotIndex] = null;
    setPlacements(next);
    setSelectedItem(item);
    setMessage(`${item} returned to the tray. Choose a step for it.`);
    setFeedbackKind('guide');
  }

  function reset() {
    setPlacements(slotLabels.map(() => null));
    setSelectedItem(null);
    setMessage(instruction);
    setFeedbackKind('guide');
    setComplete(false);
    setCompletionSummary('');
    onReset?.();
  }

  return (
    <section className="activity-stage" aria-label="Drag-and-drop challenge">
      <p className="activity-instruction">{instruction}</p>
      <div className="sequence-slots" role="group" aria-label="Ordered steps">
        {slotLabels.map((label, index) => (
          <div className="sequence-slot-wrap" key={`${resetKey}-${index}`}>
            <button
              type="button"
              className={`sequence-slot${placements[index] !== null ? ' is-filled' : ''}${selectedItem !== null && placements[index] === null ? ' can-receive' : ''}`}
              aria-label={placements[index] === null ? `Step ${index + 1}: ${label}, empty` : `Step ${index + 1}: ${label}, ${placements[index]}. Activate to remove.`}
              disabled={complete}
              onClick={() => placements[index] === null ? placeItem(index) : removeItem(index)}
              onDragOver={(event) => {
                if (!complete && placements[index] === null) event.preventDefault();
              }}
              onDrop={(event) => {
                event.preventDefault();
                if (!complete && placements[index] === null) {
                  placeItem(index, Number(event.dataTransfer.getData('text/plain')));
                }
              }}
            >
              <span className="sequence-slot-number">{index + 1}</span>
              <strong>{placements[index] === null ? 'Drop here' : placements[index]}</strong>
              <span>{label}</span>
            </button>
            {index < slotLabels.length - 1 && <span className="sequence-connector" aria-hidden="true">→</span>}
          </div>
        ))}
      </div>
      <div className="sequence-tray" aria-label="Available tiles">
        {availableItems.map((item) => (
          <button
            type="button"
            className={`sequence-tile${selectedItem === item ? ' is-selected' : ''}`}
            aria-pressed={selectedItem === item}
            draggable
            disabled={complete}
            key={item}
            onClick={() => chooseItem(item)}
            onDragStart={(event) => {
              event.dataTransfer.setData('text/plain', String(item));
              event.dataTransfer.effectAllowed = 'move';
              setSelectedItem(item);
            }}
          >
            {item}
          </button>
        ))}
        {availableItems.length === 0 && !complete && <span className="sequence-tray-note">All tiles are placed. Review your order.</span>}
      </div>
      <div className={`tree-tutor-feedback is-${feedbackKind}`} role="status" aria-live="polite">
        <strong>{complete ? 'Challenge complete' : feedbackKind === 'incorrect' ? 'Think it through' : 'Your tutor'}</strong>
        <p>{complete ? completionSummary : message}</p>
      </div>
      <button className="tree-challenge-reset" type="button" onClick={reset}>Start this activity over</button>
    </section>
  );
}
