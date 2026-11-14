import { describe, expect, it, vi } from 'vitest';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SOUND_FILES, createReadAloudPlayer, createSoundPlayer, readAloudUrl, soundUrl } from '../src/audio/sound.js';
import questions from '../src/content/questions.json';

const publicDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

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
    expect(soundUrl('correct', '/cos750-exam/')).toBe('/cos750-exam/sounds/correct_answer.mp3');
    expect(soundUrl('incorrect', '/cos750-exam')).toBe('/cos750-exam/sounds/incorrect_answer.mp3');
  });

  it('returns null for an unknown cue name', () => {
    expect(soundUrl('fanfare', '/')).toBeNull();
  });

  it('defines the two answer cues and the lecture-ready cheer', () => {
    expect(Object.keys(SOUND_FILES).sort()).toEqual(['cheer', 'correct', 'incorrect']);
    expect(soundUrl('cheer', '/')).toBe('/sounds/lecture_ready_crowd_cheers.mp3');
  });

  it('every cue file exists in public/', () => {
    for (const file of Object.values(SOUND_FILES)) {
      expect(existsSync(join(publicDir, file)), file).toBe(true);
    }
  });
});

describe('read-aloud recordings', () => {
  it('builds the URL from the question audio file name, or null without one', () => {
    expect(readAloudUrl('Q01.mp3', '/cos750-exam/')).toBe('/cos750-exam/sounds/Q01.mp3');
    expect(readAloudUrl(undefined, '/')).toBeNull();
    expect(readAloudUrl('', '/')).toBeNull();
  });

  it('every audio field in questions.json points at a file in public/sounds/', () => {
    const withAudio = questions.filter((question) => question.audio !== undefined);
    expect(withAudio.length).toBeGreaterThan(0);
    for (const question of withAudio) {
      expect(existsSync(join(publicDir, 'sounds', question.audio)), `${question.id} -> ${question.audio}`).toBe(true);
    }
  });

  it('plays one recording at a time and reports when it ends', () => {
    const { createAudio, created } = fakeAudioFactory();
    const player = createReadAloudPlayer({ createAudio: (src) => Object.assign(createAudio(src), { pause: vi.fn() }), base: '/' });
    const firstEnd = vi.fn();
    const secondEnd = vi.fn();

    expect(player.play('Q01.mp3', { onEnd: firstEnd })).toBe(true);
    expect(player.isPlaying()).toBe(true);
    player.play('Q02.mp3', { onEnd: secondEnd });
    expect(created[0].pause).toHaveBeenCalled();
    expect(firstEnd).toHaveBeenCalledTimes(1);

    created[1].onended();
    expect(secondEnd).toHaveBeenCalledTimes(1);
    expect(player.isPlaying()).toBe(false);
    created[1].onended(); // a late duplicate event changes nothing
    expect(secondEnd).toHaveBeenCalledTimes(1);
  });

  it('stop() ends playback and calls onEnd once', () => {
    const { createAudio, created } = fakeAudioFactory();
    const player = createReadAloudPlayer({ createAudio: (src) => Object.assign(createAudio(src), { pause: vi.fn() }), base: '/' });
    const onEnd = vi.fn();

    player.play('Q03.mp3', { onEnd });
    player.stop();
    player.stop();
    expect(created[0].pause).toHaveBeenCalledTimes(1);
    expect(onEnd).toHaveBeenCalledTimes(1);
    expect(player.isPlaying()).toBe(false);
  });

  it('does nothing for a question without a recording', () => {
    const { createAudio } = fakeAudioFactory();
    const player = createReadAloudPlayer({ createAudio, base: '/' });
    expect(player.play(undefined)).toBe(false);
    expect(createAudio).not.toHaveBeenCalled();
  });

  it('treats a failed play as finished so the button resets', async () => {
    const { createAudio } = fakeAudioFactory(() => Promise.reject(new Error('NotAllowedError')));
    const player = createReadAloudPlayer({ createAudio: (src) => Object.assign(createAudio(src), { pause: vi.fn() }), base: '/' });
    const onEnd = vi.fn();
    player.play('Q04.mp3', { onEnd });
    await Promise.resolve();
    await Promise.resolve();
    expect(onEnd).toHaveBeenCalledTimes(1);
    expect(player.isPlaying()).toBe(false);
  });
});

describe('createSoundPlayer', () => {
  it('plays the correct cue from the start', () => {
    const { createAudio, created } = fakeAudioFactory();
    const playSound = createSoundPlayer({ createAudio, base: '/' });

    expect(playSound('correct')).toBe(true);
    expect(createAudio).toHaveBeenCalledWith('/sounds/correct_answer.mp3');
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
