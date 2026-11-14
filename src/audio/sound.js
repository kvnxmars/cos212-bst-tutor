// Short sound cues for quiz feedback. Pure JavaScript, no React, so the
// URL building and mute behaviour can be unit tested in Node.
//
// Files live in public/sounds/ and are served under the Vite base path
// (/cos750-exam/ on GitHub Pages), so URLs are built from BASE_URL.

export const SOUND_FILES = Object.freeze({
  correct: 'sounds/correct_answer.m4a',
  incorrect: 'sounds/incorrect_answer.m4a',
});

function defaultBase() {
  return import.meta.env?.BASE_URL ?? '/';
}

/** Public URL for a named cue, or null when the name is unknown. */
export function soundUrl(name, base = defaultBase()) {
  const file = SOUND_FILES[name];
  if (!file) return null;
  const prefix = base.endsWith('/') ? base : `${base}/`;
  return `${prefix}${file}`;
}

/**
 * Builds a `playSound(name, { muted })` function. `createAudio` is injectable so
 * tests can run without a browser. Playback failures (autoplay policy, missing
 * file, unsupported codec) are swallowed: a cue is never allowed to break the quiz.
 * @returns {(name: string, options?: { muted?: boolean }) => boolean} true when a play was attempted
 */
export function createSoundPlayer({ createAudio = (src) => new Audio(src), base } = {}) {
  const cache = new Map();

  return function playSound(name, { muted = false } = {}) {
    if (muted) return false;
    const url = soundUrl(name, base ?? defaultBase());
    if (!url) return false;

    try {
      let audio = cache.get(name);
      if (!audio) {
        audio = createAudio(url);
        cache.set(name, audio);
      }
      audio.currentTime = 0;
      const result = audio.play();
      if (result && typeof result.catch === 'function') result.catch(() => {});
      return true;
    } catch {
      return false;
    }
  };
}

export const playSound = createSoundPlayer();
