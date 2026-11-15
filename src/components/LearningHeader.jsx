import { useStudentState } from '../state/StudentState.jsx';
import { WALLPAPER_THEME_ID, activeBannerIdFor } from '../assessment/rewards.js';
import rewards from '../content/rewards.json';
import CourseNavigation from './CourseNavigation.jsx';
import CourseResetButton from './CourseResetButton.jsx';
import { bannerSvg, svgDataUrl } from './rewardArt.js';

export default function LearningHeader({ lessonId = 1, showBackToLesson = true, children }) {
  const { studentState } = useStudentState();
  const bannerId = activeBannerIdFor(studentState);
  // With the wallpaper theme active, the header still shows the latest lesson banner.
  const bannerToShow = bannerId === WALLPAPER_THEME_ID ? studentState.earnedBanners.at(-1) : bannerId;
  const banner = rewards.find((reward) => reward.id === bannerToShow && studentState.earnedBanners.includes(reward.id));

  return (
    <header className="learning-header">
      <div className="learning-header-brand">
        <CourseNavigation lessonId={lessonId} />
        <a href="#welcome">COS212 BST Tutor</a>
        
      </div>
      <div className="learning-header-actions">
        {showBackToLesson && (
          <a className="visualizer-back-link" href={`#lesson?lesson=${lessonId}`}>Back to lesson</a>
        )}
        {children}
        <a className={`reward-banner${banner ? ' has-reward' : ''}`} href="#rewards">
          {banner
            ? <img src={svgDataUrl(bannerSvg(banner))} alt={`Your banner: ${banner.title}. Open rewards`} />
            : 'Rewards'}
        </a>
        <CourseResetButton />
      </div>
    </header>
  );
}
