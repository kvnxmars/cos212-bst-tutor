import { useState } from 'react';
import { useStudentState } from '../state/StudentState.jsx';
import CourseResetButton from './CourseResetButton.jsx';

const ACTIVITY_LABELS = {
  1: 'Tree parts & BST rules',
  2: 'Search & insert',
  3: 'Traversal challenge',
  4: 'Shape & search cost',
};

export default function LearningHeader({ lessonId = 1 }) {
  const [alternativesOpen, setAlternativesOpen] = useState(false);
  const { studentState } = useStudentState();
  const hasBanner = studentState.earnedBanners.length > 0;

  return (
    <header className="learning-header">
      <a href="#welcome">COS212 BST Tutor</a>
      <button
        className="learning-alternatives-trigger"
        type="button"
        aria-expanded={alternativesOpen}
        onClick={() => setAlternativesOpen((open) => !open)}
      >
        Try another way
      </button>
      <div className="learning-header-actions">
        <div className={`reward-banner${hasBanner ? ' has-reward' : ''}`}>
          {hasBanner ? 'Banner unlocked for lesson mastery' : 'Banner (earned reward)'}
        </div>
        <CourseResetButton />
      </div>
      {alternativesOpen && (
        <nav className="learning-alternatives-panel" id="learning-alternatives" aria-label="Other learning activities">
          <a href={`#video?lesson=${lessonId}`} onClick={() => setAlternativesOpen(false)}>Watch this lesson’s video</a>
          <a href={`#build-tree?lesson=${lessonId}`} onClick={() => setAlternativesOpen(false)}>{ACTIVITY_LABELS[lessonId]}</a>
        </nav>
      )}
    </header>
  );
}
