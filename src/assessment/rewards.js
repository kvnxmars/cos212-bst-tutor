// Reward rules (SE document 4.7): banners for lesson mastery, one wallpaper for
// passing the mastery check. Rewards are only ever added, never removed by a
// failed retry, and are cosmetic.

export function bannerIdFor(lessonId) {
  return `lesson-${lessonId}`;
}

export function awardLessonBanner(earnedBanners, lessonId) {
  const id = bannerIdFor(lessonId);
  return earnedBanners.includes(id) ? earnedBanners : [...earnedBanners, id];
}

// The mastery wallpaper doubles as an app colour theme once the check is passed.
export const WALLPAPER_THEME_ID = 'mastery-wallpaper';

/** Ids of every colour theme the student has unlocked, in the order they were earned. */
export function earnedThemeIds(studentState) {
  const banners = studentState.earnedBanners.filter((id) => /^lesson-[1-4]$/.test(id));
  return studentState.masteryCheck?.passed === true ? [...banners, WALLPAPER_THEME_ID] : banners;
}

/** Id of the active colour theme (a banner or the wallpaper), or null for the default theme. */
export function activeBannerIdFor(studentState) {
  if (studentState.selectedBanner === 'default') return null;
  const themes = earnedThemeIds(studentState);
  return themes.includes(studentState.selectedBanner)
    ? studentState.selectedBanner
    : themes.at(-1) ?? null;
}

export function isRewardEarned(reward, studentState) {
  if (reward.type === 'wallpaper') return studentState.masteryCheck?.passed === true;
  return studentState.earnedBanners.includes(reward.id);
}
