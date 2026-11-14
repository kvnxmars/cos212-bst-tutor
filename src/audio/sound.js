// Sound for the quizzes. Pure JavaScript, no React, so the URL building, mute
// behaviour and read-aloud playback can be unit tested in Node.
//
// Files live in public/sounds/ and are served under the Vite base path
// (/cos750-exam/ on GitHub Pages), so URLs are built from BASE_URL.
//
// Two kinds of sound:
// - Cues (correct / incorrect answer, lecture-ready cheer): play automatically and
//   are silenced by the Sound switch in Settings.
// - Read-aloud recordings of question text: play only when the student presses the
//   megaphone button, so they are not affected by the Sound switch.

export const SOUND_FILES = Object.freeze({
  correct: 'sounds/correct_answer.mp3',
  incorrect: 'sounds/incorrect_answer.mp3',
  cheer: 'sounds/lecture_ready_crowd_cheers.mp3',
});

function defaultBase() {
  return import.meta.env?.BASE_URL ?? '/';
}

function publicUrl(path, base) {
  const prefix = base.endsWith('/') ? base : `${base}/`;
  return `${prefix}${path}`;
}

/** Public URL for a named cue, or null when the name is unknown. */
export function soundUrl(name, base = defaultBase()) {
  const file = SOUND_FILES[name];
  return file ? publicUrl(file, base) : null;
}

/**
 * Public URL for a question's read-aloud recording (the `audio` field in
 * questions.json, a file name inside public/sounds/), or null when it has none.
 */
export function readAloudUrl(file, base = defaultBase()) {
  return typeof file === 'string' && file ? publicUrl(`sounds/${file}`, base) : null;
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

/**
 * Builds a read-aloud player that plays one recording at a time. Starting a new
 * recording, or calling stop(), ends the current one. `onEnd` is called exactly
 * once per play: when the recording finishes, fails, or is stopped.
 */
export function createReadAloudPlayer({ createAudio = (src) => new Audio(src), base } = {}) {
  let current = null; // { audio, onEnd }

  function finish(entry) {
    if (!entry || current !== entry) return;
    current = null;
    entry.onEnd?.();
  }

  function stop() {
    const entry = current;
    if (!entry) return;
    try {
      entry.audio.pause();
      entry.audio.currentTime = 0;
    } catch {
      // Nothing to do: the recording is being abandoned anyway.
    }
    finish(entry);
  }

  /** @returns {boolean} true when playback was started */
  function play(file, { onEnd } = {}) {
    stop();
    const url = readAloudUrl(file, base ?? defaultBase());
    if (!url) return false;

    try {
      const entry = { audio: createAudio(url), onEnd };
      current = entry;
      entry.audio.onended = () => finish(entry);
      entry.audio.onerror = () => finish(entry);
      const result = entry.audio.play();
      if (result && typeof result.catch === 'function') result.catch(() => finish(entry));
      return true;
    } catch {
      current = null;
      return false;
    }
  }

  return { play, stop, isPlaying: () => current !== null };
}

export const playSound = createSoundPlayer();
export const readAloud = createReadAloudPlayer();
