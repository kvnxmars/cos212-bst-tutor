import LearningHeader from './LearningHeader.jsx';
import lessons from '../content/lessons.json';

export default function LessonAccessNotice({ lessonId = 1, destination = 'This page' }) {
  const lesson = lessons.find((item) => item.id === lessonId) ?? lessons[0];

  return (
    <main className="learning-shell">
      <LearningHeader lessonId={lesson.id} />
      <section className="lesson-locked" role="status">
        <h1>{destination} is locked</h1>
        <p>Pass the previous lesson’s quick quiz before opening Lesson {lesson.id} resources. Activities and videos are optional.</p>
        <a href={`#lesson?lesson=${Math.max(1, lesson.id - 1)}`}>Go to the previous lesson</a>
      </section>
    </main>
  );
}
