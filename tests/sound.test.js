import { describe, expect, it, vi } from 'vitest';
import { SOUND_FILES, createSoundPlayer, soundUrl } from '../src/audio/sound.js';

function fakeAudioFactory(playImpl = () => Promise.resolve()) {
  const created = [];
  const createAudio = vi.fn((src) => {
    const audio = { src, currentTime: 5, play: vi.fn(playImpl) };
    created.push(audio);
    return audio;
  });
  return { createAudio, created };
}

describe('soundUrl', () => {
  it('serves cues from the Vite base path so they work on GitHub Pages', () => {
    expect(soundUrl('correct', '/cos750-exam/')).toBe('/cos750-exam/sounds/correct_answer.m4a');
    expect(soundUrl('incorrect', '/cos750-exam')).toBe('/cos750-exam/sounds/incorrect_answer.m4a');
  });

  it('returns null for an unknown cue name', () => {
    expect(soundUrl('fanfare', '/')).toBeNull();
  });

  it('defines exactly the two quiz cues', () => {
    expect(Object.keys(SOUND_FILES).sort()).toEqual(['correct', 'incorrect']);
  });
});

describe('createSoundPlayer', () => {
  it('plays the correct cue from the start', () => {
    const { createAudio, created } = fakeAudioFactory();
    const playSound = createSoundPlayer({ createAudio, base: '/' });

    expect(playSound('correct')).toBe(true);
    expect(createAudio).toHaveBeenCalledWith('/sounds/correct_answer.m4a');
    expect(created[0].currentTime).toBe(0);
    expect(created[0].play).toHaveBeenCalledTimes(1);
  });

  it('does nothing when muted', () => {
    const { createAudio } = fakeAudioFactory();
    const playSound = createSoundPlayer({ createAudio, base: '/' });

    expect(playSound('incorrect', { muted: true })).toBe(false);
    expect(createAudio).not.toHaveBeenCalled();
  });

  it('reuses one Audio element per cue', () => {
    const { createAudio, created } = fakeAudioFactory();
    const playSound = createSoundPlayer({ createAudio, base: '/' });

    playSound('incorrect');
    playSound('incorrect');
    playSound('correct');
    expect(createAudio).toHaveBeenCalledTimes(2);
    expect(created[0].play).toHaveBeenCalledTimes(2);
  });

  it('ignores unknown cue names', () => {
    const { createAudio } = fakeAudioFactory();
    const playSound = createSoundPlayer({ createAudio, base: '/' });
    expect(playSound('fanfare')).toBe(false);
    expect(createAudio).not.toHaveBeenCalled();
  });

  it('swallows playback failures so a blocked autoplay never breaks the quiz', async () => {
    const rejected = fakeAudioFactory(() => Promise.reject(new Error('NotAllowedError')));
    const playRejecting = createSoundPlayer({ createAudio: rejected.createAudio, base: '/' });
    expect(playRejecting('correct')).toBe(true);
    await Promise.resolve(); // let the rejection settle; no unhandled rejection

    const throwing = createSoundPlayer({ createAudio: () => { throw new Error('no Audio here'); }, base: '/' });
    expect(() => throwing('correct')).not.toThrow();
    expect(throwing('correct')).toBe(false);
  });
});
