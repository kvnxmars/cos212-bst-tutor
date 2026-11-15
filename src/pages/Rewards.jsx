import LearningHeader from '../components/LearningHeader.jsx';
import { bannerSvg, downloadText, svgDataUrl, wallpaperSvg } from '../components/rewardArt.js';
import rewards from '../content/rewards.json';
import { activeBannerIdFor, isRewardEarned } from '../assessment/rewards.js';
import { useStudentState } from '../state/StudentState.jsx';
import DefaultThemeButton from '../components/DefaultThemeButton.jsx';

// Reward gallery (FR17): earned and locked rewards, theme reset, wallpaper download.
export default function Rewards() {
  const { studentState, setStudentState } = useStudentState();
  const activeBannerId = activeBannerIdFor(studentState);

  return (
    <main className="learning-shell rewards-shell">
      <LearningHeader lessonId={4} />
      <nav className="lesson-breadcrumb" aria-label="Breadcrumb">
        <a href="#welcome">Home</a><span>&gt;</span><span>Rewards</span>
      </nav>
      <h1>Your rewards</h1>
      <p className="rewards-intro">Banners are earned by mastering a lesson and the wallpaper by passing the final mastery check. They are never taken away.</p>
      <div className="reward-theme-actions"><DefaultThemeButton /></div>
      <ul className="reward-grid">
        {rewards.map((reward) => {
          const earned = isRewardEarned(reward, studentState);
          const art = reward.type === 'wallpaper' ? wallpaperSvg(reward) : bannerSvg(reward);
          return (
            <li key={reward.id} className={`reward-card is-${reward.type}${earned ? ' is-earned' : ' is-locked'}`}>
              <img src={svgDataUrl(art)} alt={earned ? `${reward.title} ${reward.type}` : ''} />
              <h2>{reward.title}</h2>
              <p>{earned ? (reward.type === 'wallpaper' ? 'Wallpaper earned' : 'Banner earned') : `Locked: ${reward.unlock}`}</p>
              {earned && reward.type === 'banner' && (
                <button
                  type="button"
                  aria-pressed={activeBannerId === reward.id}
                  onClick={() => setStudentState((state) => ({ ...state, selectedBanner: reward.id }))}
                >
                  {activeBannerId === reward.id ? 'Using banner' : 'Use banner'}
                </button>
              )}
              {earned && reward.type === 'wallpaper' && (
                <>
                  <button
                    type="button"
                    aria-pressed={activeBannerId === reward.id}
                    onClick={() => setStudentState((state) => ({ ...state, selectedBanner: reward.id }))}
                  >
                    {activeBannerId === reward.id ? 'Using as theme' : 'Use as theme'}
                  </button>
                  <button type="button" onClick={() => downloadText('bst-lecture-ready-wallpaper.svg', art, 'image/svg+xml')}>
                    Download wallpaper
                  </button>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </main>
  );
}
