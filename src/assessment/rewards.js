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

export function activeBannerIdFor(studentState) {
  if (studentState.selectedBanner === 'default') return null;
  const earnedBanners = studentState.earnedBanners.filter((id) => /^lesson-[1-4]$/.test(id));
  return earnedBanners.includes(studentState.selectedBanner)
    ? studentState.selectedBanner
    : earnedBanners.at(-1) ?? null;
}

export function isRewardEarned(reward, studentState) {
  if (reward.type === 'wallpaper') return studentState.masteryCheck?.passed === true;
  return studentState.earnedBanners.includes(reward.id);
}
