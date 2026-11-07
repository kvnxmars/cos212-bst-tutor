import { useState } from 'react';
import LearningHeader from '../components/LearningHeader.jsx';

const LESSONS = [
  { title: '1. BST property', status: 'Mastered', complete: true },
  { title: '2. Insert and search', status: 'In progress', current: true },
  { title: '3. Traversals', status: 'Locked' },
  { title: '4. Complexity', status: 'Locked' },
];

export default function Lesson() {
  const [captionsOn, setCaptionsOn] = useState(true);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [learningStyle, setLearningStyle] = useState('Visual');

  return (
    <main className="learning-shell">
      <LearningHeader />
      <div className="lesson-topline">
        <nav className="lesson-breadcrumb" aria-label="Breadcrumb">
          <a href="#welcome">Home</a><span>&gt;</span><span>Lesson 2</span><span>&gt;</span><span>Insert and search</span>
        </nav>
        <div className="lesson-progress">
          <div className="progress-track" role="progressbar" aria-label="Course progress" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
            <span />
          </div>
          <span>25% done</span>
        </div>
      </div>

      <div className="lesson-layout">
        <section className="lesson-main" aria-labelledby="lesson-title">
          <h1 id="lesson-title">Lesson 2: Insert and search</h1>
          <p className="lesson-meta">Difficulty: Easy <span>|</span> About 5 min</p>
          <div className="lesson-video-placeholder">
            <button type="button" className="video-play-placeholder" aria-label="Lesson video placeholder" onClick={() => setNotice('Lesson video content will be added when the lesson plan is ready.')}>
              <span aria-hidden="true" />
            </button>
            <p>Lesson video (animated tree + narration)</p>
            <div className="lesson-video-options">
              <button type="button" onClick={() => setCaptionsOn((on) => !on)}>[ Captions {captionsOn ? 'on' : 'off'} ]</button>
              <button type="button" onClick={() => setTranscriptOpen((open) => !open)}>Transcript {transcriptOpen ? '⌃' : '⌄'}</button>
            </div>
            {transcriptOpen && <p className="transcript-placeholder">Transcript placeholder — lesson narration will appear here.</p>}
            <div className="video-progress-track"><span /></div>
          </div>

          <div className="lesson-actions">
            <button type="button" onClick={() => setNotice('Alternative lesson formats will be added with the lesson plan.')}>Show me another way</button>
            <a href="#visualizer">Try it in the visualiser</a>
            <button type="button" onClick={() => setNotice('The quick quiz will be added with the lesson plan.')}>Take quick quiz</button>
          </div>
          {notice && <p className="lesson-notice" role="status">{notice}</p>}
        </section>

        <aside className="lesson-sidebar">
          <section className="lesson-list-panel" aria-label="Lessons">
            <h2>Lessons</h2>
            <ol>
              {LESSONS.map((lesson) => (
                <li className={`${lesson.current ? 'is-current' : ''}${lesson.complete ? ' is-complete' : ''}`} key={lesson.title}>
                  <strong>{lesson.title}</strong>
                  <span>{lesson.status}</span>
                </li>
              ))}
            </ol>
          </section>
          <button type="button" className="format-button" onClick={() => setLearningStyle((current) => current === 'Visual' ? 'Auditory' : 'Visual')}>
            Format: {learningStyle} <span>(change)</span>
          </button>
        </aside>
      </div>
      <span className="screen-caption">Screen 2: Lesson page (video variant shown)</span>
    </main>
  );
}