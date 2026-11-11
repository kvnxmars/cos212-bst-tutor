import LearningHeader from '../components/LearningHeader.jsx';
import { downloadText, svgDataUrl, wallpaperSvg } from '../components/rewardArt.js';
import lessons from '../content/lessons.json';
import misconceptions from '../content/misconceptions.json';
import outcomes from '../content/outcomes.json';
import rewards from '../content/rewards.json';
import { misconceptionsCsv } from '../assessment/scoring.js';
import { useStudentState } from '../state/StudentState.jsx';

const LECTURE_QUESTIONS = [
  'What if the tree is stick-shaped? Can it fix itself?',
  'How would we delete a node that has two children without breaking the BST rule?',
  'When would a hash table be a better choice than a BST?',
];

export default function LectureReady() {
  const { studentState } = useStudentState();
  const { masteryCheck, firstAttemptScores, misconceptionsHit } = studentState;
  const wallpaper = rewards.find((reward) => reward.type === 'wallpaper');

  if (!masteryCheck.passed) {
    return (
      <main className="learning-shell">
        <LearningHeader lessonId={4} />
        <section className="lesson-locked" role="status">
          <h1>Your lecture-ready card is locked</h1>
          <p>Pass the final mastery check to unlock it.</p>
          <a href="#mastery">Go to the mastery check</a>
        </section>
      </main>
    );
  }

  const firstScores = lessons
    .filter((lesson) => lesson.id in firstAttemptScores)
    .map((lesson) => ({ lesson, percentage: firstAttemptScores[lesson.id] }));
  const firstAverage = firstScores.length
    ? Math.round(firstScores.reduce((total, item) => total + item.percentage, 0) / firstScores.length)
    : null;
  const stillWorkingOn = masteryCheck.lastMissedOutcomes ?? [];

  return (
    <main className="learning-shell lecture-ready-shell">
      <LearningHeader lessonId={4} />
      <nav className="lesson-breadcrumb" aria-label="Breadcrumb">
        <a href="#welcome">Home</a><span>&gt;</span><span>Lecture-ready card</span>
      </nav>
      <section className="lecture-ready-card" aria-labelledby="lecture-ready-title">
        <p className="eyebrow">LECTURE-READY CARD</p>
        <h1 id="lecture-ready-title">You are ready for the BST lecture</h1>

        <h2>What you have mastered</h2>
        <ul className="mastered-list">
          {Object.entries(outcomes)
            .filter(([id]) => !stillWorkingOn.includes(id))
            .map(([id, text]) => <li key={id}>✓ {text}</li>)}
        </ul>
        {stillWorkingOn.length > 0 && (
          <>
            <h3>Worth another look</h3>
            <ul>{stillWorkingOn.map((id) => <li key={id}>{outcomes[id]}</li>)}</ul>
          </>
        )}

        <h2>Your progress</h2>
        <p>
          First-attempt lesson quizzes: {firstAverage === null ? 'not recorded' : `${firstAverage}% on average`}
          {' '}→ final mastery check: {masteryCheck.bestPercentage}%.
        </p>
        {firstScores.length > 0 && (
          <ul className="first-attempt-list">
            {firstScores.map(({ lesson, percentage }) => <li key={lesson.id}>Lesson {lesson.id} first attempt: {percentage}%</li>)}
          </ul>
        )}

        <h2>Questions to bring to the lecture</h2>
        <ol>{LECTURE_QUESTIONS.map((question) => <li key={question}>{question}</li>)}</ol>

        <div className="lecture-ready-actions">
          <button
            type="button"
            className="learning-primary-button"
            onClick={() => downloadText('bst-lecture-ready-wallpaper.svg', wallpaperSvg(wallpaper), 'image/svg+xml')}
          >
            Download your wallpaper
          </button>
          <button
            type="button"
            className="learning-secondary-button"
            disabled={misconceptionsHit.length === 0}
            onClick={() => downloadText('bst-misconceptions.csv', misconceptionsCsv(misconceptionsHit, misconceptions), 'text/csv')}
          >
            {misconceptionsHit.length === 0 ? 'No misconceptions recorded' : 'Export misconceptions (CSV) for the lecturer'}
          </button>
          <a href="#rewards">See all your rewards</a>
        </div>
      </section>
      <figure className="wallpaper-preview">
        <img src={svgDataUrl(wallpaperSvg(wallpaper))} alt={`${wallpaper.title} wallpaper preview`} />
        <figcaption>Wallpaper unlocked: {wallpaper.title}</figcaption>
      </figure>
    </main>
  );
}
