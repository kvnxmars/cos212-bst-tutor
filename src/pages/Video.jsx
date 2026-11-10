import LearningHeader from '../components/LearningHeader.jsx';
import VideoEmbed from '../components/VideoEmbed.jsx';
import videos from '../content/videos.json';
import lessons from '../content/lessons.json';
import { useStudentState } from '../state/StudentState.jsx';
import '../styles/theme.css';

export default function VideoPage({ lessonId = 1 }) {
  const { studentState } = useStudentState();
  const lesson = lessons.find((item) => item.id === lessonId) ?? lessons[0];
  const video = videos[String(lesson.id)];
  const progress = Math.round((studentState.masteredLessons.length / lessons.length) * 100);

  return (
    <main className="learning-shell alternate-learning-shell">
      <LearningHeader lessonId={lesson.id} />
      <div className="lesson-topline">
        <nav className="lesson-breadcrumb" aria-label="Breadcrumb">
          <a href="#welcome">Home</a><span>&gt;</span><a href={`#lesson?lesson=${lesson.id}`}>Lesson {lesson.id}</a><span>&gt;</span><span>Watch a video</span>
        </nav>
        <div className="lesson-progress">
          <div className="progress-track" role="progressbar" aria-label="Lessons mastered" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
            <span style={{ width: `${progress}%` }} />
          </div>
          <span>{progress}% done</span>
        </div>
      </div>
      <section className="video-learning-page" aria-labelledby="video-learning-title">
        <p className="eyebrow">WATCH AND LEARN</p>
        <div className="alternate-page-heading">
          <div>
            <h1 id="video-learning-title">Watch a video</h1>
            <p>Use this visual explanation alongside “{lesson.title}”.</p>
          </div>
          <a href={`#lesson?lesson=${lesson.id}`}>Back to lesson</a>
        </div>
        <article className="video-learning-card">
          <VideoEmbed videoId={video.id} title={video.title} />
          <div className="video-learning-details">
            <h2>{video.title}</h2>
            <p>{video.focus}</p>
            <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noreferrer">
              Open video on YouTube
            </a>
          </div>
        </article>
        <div className="video-learning-next">
          <a href={`#build-tree?lesson=${lesson.id}`}>Ready to practise? Try the Lesson {lesson.id} activity</a>
          <a href={`#visualizer?lesson=${lesson.id}`}>Watch an animated example</a>
        </div>
      </section>
    </main>
  );
}
