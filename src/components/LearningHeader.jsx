import { useState } from 'react';
import { useStudentState } from '../state/StudentState.jsx';
import rewards from '../content/rewards.json';
import AccessibilityMenu from './AccessibilityMenu.jsx';
import CourseResetButton from './CourseResetButton.jsx';
import { bannerSvg, svgDataUrl } from './rewardArt.js';

const ACTIVITY_LABELS = {
  1: 'Tree parts & BST rules',
  2: 'Search & insert',
  3: 'Traversal challenge',
  4: 'Shape & search cost',
};

export default function LearningHeader({ lessonId = 1 }) {
  const [alternativesOpen, setAlternativesOpen] = useState(false);
  const { studentState } = useStudentState();
  // Show the banner the student chose in the gallery, otherwise the latest one earned.
  const bannerId = studentState.selectedBanner ?? studentState.earnedBanners.at(-1);
  const banner = rewards.find((reward) => reward.id === bannerId && studentState.earnedBanners.includes(reward.id));

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
        <a className={`reward-banner${banner ? ' has-reward' : ''}`} href="#rewards">
          {banner
            ? <img src={svgDataUrl(bannerSvg(banner))} alt={`Your banner: ${banner.title}. Open rewards`} />
            : 'Rewards'}
        </a>
        <AccessibilityMenu />
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
