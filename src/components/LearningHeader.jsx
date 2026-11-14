import { useStudentState } from '../state/StudentState.jsx';
import { activeBannerIdFor } from '../assessment/rewards.js';
import rewards from '../content/rewards.json';
import CourseNavigation from './CourseNavigation.jsx';
import CourseResetButton from './CourseResetButton.jsx';
import { bannerSvg, svgDataUrl } from './rewardArt.js';

export default function LearningHeader({ lessonId = 1 }) {
  const { studentState } = useStudentState();
  const bannerId = activeBannerIdFor(studentState);
  const banner = rewards.find((reward) => reward.id === bannerId && studentState.earnedBanners.includes(reward.id));

  return (
    <header className="learning-header">
      <a href="#welcome">COS212 BST Tutor</a>
      <CourseNavigation lessonId={lessonId} />
      <div className="learning-header-actions">
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
