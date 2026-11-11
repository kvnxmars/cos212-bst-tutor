export function isLessonUnlocked(lessonId, masteredLessons) {
  return lessonId === 1 || masteredLessons.includes(lessonId - 1);
}

/** Lesson a returning student should continue from: the first one not yet mastered. */
export function resumeLocation(masteredLessons, lessonCount = 4) {
  for (let lessonId = 1; lessonId <= lessonCount; lessonId += 1) {
    if (!masteredLessons.includes(lessonId)) return `#lesson?lesson=${lessonId}`;
  }
  return '#mastery';
}
