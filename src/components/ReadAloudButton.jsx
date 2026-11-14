import { useEffect, useState } from 'react';
import { readAloud } from '../audio/sound.js';

// Megaphone button that reads the current question aloud from a recording in
// public/sounds/ (the question's `audio` field). Press again to stop. Renders
// nothing for questions without a recording.
export default function ReadAloudButton({ audio }) {
  const [playing, setPlaying] = useState(false);

  // Stop when the question changes or the page is left.
  useEffect(() => () => readAloud.stop(), [audio]);

  if (!audio) return null;

  function toggle() {
    if (playing) {
      readAloud.stop();
      return;
    }
    if (readAloud.play(audio, { onEnd: () => setPlaying(false) })) setPlaying(true);
  }

  return (
    <button
      type="button"
      className={`read-aloud-button${playing ? ' is-playing' : ''}`}
      aria-pressed={playing}
      aria-label={playing ? 'Stop reading the question aloud' : 'Read the question aloud'}
      title={playing ? 'Stop reading' : 'Read aloud'}
      onClick={toggle}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
        <path
          d="M3 10v4a1 1 0 0 0 1 1h2l1.2 4.3a1 1 0 0 0 1 .7h1.3a.8.8 0 0 0 .8-1L9.2 15H10l7 4V5l-7 4H4a1 1 0 0 0-1 1Z"
          fill="currentColor"
        />
        {playing ? (
          <path d="M20 9v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        ) : (
          <path d="M19.5 9.5a3.5 3.5 0 0 1 0 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        )}
      </svg>
      <span className="read-aloud-label">{playing ? 'Stop' : 'Listen'}</span>
    </button>
  );
}
