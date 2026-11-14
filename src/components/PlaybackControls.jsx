export default function PlaybackControls({
  stepIndex,
  stepCount,
  isPlaying,
  speed,
  onBack,
  onTogglePlay,
  onNext,
  onReset,
  onCycleSpeed,
}) {
  return (
    <div className="playback-controls">
      <span className="step-count">{stepCount ? `${stepIndex + 1} / ${stepCount}` : 'NO STEPS'}</span>
      <div className="playback-actions" aria-label="Playback controls">
        <button type="button" className="step-button" disabled={stepIndex <= 0} onClick={onBack}>Back</button>
        <button
          type="button"
          className="play-button"
          disabled={stepCount < 2}
          onClick={onTogglePlay}
          aria-pressed={isPlaying}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button type="button" className="step-button next-step" disabled={stepIndex >= stepCount - 1} onClick={onNext}>Next</button>
        <button type="button" className="playback-reset" disabled={stepCount === 0} onClick={onReset}>Reset</button>
        <button type="button" className="speed-button" onClick={onCycleSpeed}>Speed: {speed}x</button>
      </div>
    </div>
  );
}