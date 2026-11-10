export function isLessonUnlocked(lessonId, masteredLessons) {
  return lessonId === 1 || masteredLessons.includes(lessonId - 1);
}