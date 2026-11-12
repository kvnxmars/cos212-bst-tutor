import { createContext, useContext, useEffect, useState } from 'react';
import { activeBannerIdFor } from '../assessment/rewards.js';

const STORAGE_KEY = 'cos212-bst-tutor-state-v1';
const DEFAULT_STATE = {
  masteredLessons: [],
  earnedBanners: [],
  quizAttempts: {},
  activeQuiz: null,
  // First-attempt quiz percentage per lesson, kept for the ipsative comparison
  // on the lecture-ready card (ID document 4.7.5).
  firstAttemptScores: {},
  // Every misconception hit: { date, lessonId, questionId, tag } (FR22 CSV).
  misconceptionsHit: [],
  masteryCheck: { attempts: 0, passed: false, bestPercentage: null, lastMissedOutcomes: [] },
  activeMastery: null,
  selectedBanner: null,
  settings: { reducedMotion: false },
};

const isObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const StudentStateContext = createContext(null);

function readStudentState() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return { state: DEFAULT_STATE, warning: '' };
    const parsed = JSON.parse(saved);

    return {
      state: {
        ...DEFAULT_STATE,
        ...parsed,
        masteredLessons: Array.isArray(parsed.masteredLessons) ? parsed.masteredLessons : [],
        earnedBanners: Array.isArray(parsed.earnedBanners) ? parsed.earnedBanners : [],
        quizAttempts: isObject(parsed.quizAttempts) ? parsed.quizAttempts : {},
        firstAttemptScores: isObject(parsed.firstAttemptScores) ? parsed.firstAttemptScores : {},
        misconceptionsHit: Array.isArray(parsed.misconceptionsHit) ? parsed.misconceptionsHit : [],
        masteryCheck: { ...DEFAULT_STATE.masteryCheck, ...(isObject(parsed.masteryCheck) ? parsed.masteryCheck : {}) },
        settings: { ...DEFAULT_STATE.settings, ...(isObject(parsed.settings) ? parsed.settings : {}) },
      },
      warning: '',
    };
  } catch (error) {
    console.error('Unable to load saved learning progress.', error);
    return {
      state: DEFAULT_STATE,
      warning: 'Saved progress could not be loaded in this browser.',
    };
  }
}

export function StudentStateProvider({ children }) {
  const [initial] = useState(readStudentState);
  const [studentState, setStudentState] = useState(initial.state);
  const [storageWarning, setStorageWarning] = useState(initial.warning);

  function resetCourse() {
    // Accessibility settings are a preference, not progress, so they survive a reset.
    setStudentState((state) => ({ ...DEFAULT_STATE, settings: state.settings }));
    window.location.hash = '#lesson?lesson=1';
  }

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', studentState.settings.reducedMotion);
  }, [studentState.settings.reducedMotion]);

  useEffect(() => {
    document.documentElement.dataset.theme = activeBannerIdFor(studentState) ?? 'default';
  }, [studentState.earnedBanners, studentState.selectedBanner]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(studentState));
      setStorageWarning('');
    } catch (error) {
      console.error('Unable to save learning progress.', error);
      setStorageWarning('Progress is available for this visit but could not be saved in this browser.');
    }
  }, [studentState]);

  return (
    <StudentStateContext.Provider value={{ studentState, setStudentState, storageWarning, resetCourse }}>
      {children}
    </StudentStateContext.Provider>
  );
}

export function useStudentState() {
  const context = useContext(StudentStateContext);
  if (!context) throw new Error('useStudentState must be used inside StudentStateProvider.');
  return context;
}
