import { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'cos212-bst-tutor-state-v1';
const DEFAULT_STATE = {
  masteredLessons: [],
  earnedBanners: [],
  quizAttempts: {},
  activeQuiz: null,
};

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
        quizAttempts: parsed.quizAttempts && typeof parsed.quizAttempts === 'object' ? parsed.quizAttempts : {},
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
    if (!window.confirm('Start the whole course over? Your quiz scores, lesson progress, and earned banners will be cleared.')) return;
    setStudentState(DEFAULT_STATE);
    window.location.hash = '#lesson?lesson=1';
  }

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
