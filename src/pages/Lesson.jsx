import LearningHeader from '../components/LearningHeader.jsx';
import TreeView from '../components/TreeView.jsx';
import lessons from '../content/lessons.json';
import { buildTree } from '../engine/bst.js';
import { useStudentState } from '../state/StudentState.jsx';
import { isLessonUnlocked } from '../assessment/progress.js';

const ACTIVITY_LABELS = {
  1: 'Tree parts & BST rules',
  2: 'Search & insert',
  3: 'Traversal challenge',
  4: 'Shape & search cost',
};

function LessonSection({ section }) {
  return (
    <section className="lesson-content-section">
      <h2>{section.heading}</h2>
      <p>{section.body}</p>
      {section.type === 'terms' && (
        <dl className="lesson-terms">
          {section.items.map(([term, definition]) => (
            <div key={term}><dt>{term}</dt><dd>{definition}</dd></div>
          ))}
        </dl>
      )}
      {section.type === 'tree' && (
        <figure className="lesson-diagram">
          <TreeView tree={section.tree ?? buildTree(section.keys)} snapshot={null} />
          <figcaption>{section.caption}</figcaption>
        </figure>
      )}
      {section.type === 'trace' && (
        <>
          <figure className="lesson-diagram">
            <TreeView tree={buildTree(section.keys)} snapshot={null} />
          </figure>
          <div className="lesson-table-wrap">
            <table className="lesson-trace-table">
              <thead><tr><th>Step</th><th>Current key</th><th>Comparison</th><th>Next action</th></tr></thead>
              <tbody>
                {section.steps.map(([key, comparison, action], index) => (
                  <tr key={`${key}-${index}`}><td>{index + 1}</td><td>{key}</td><td>{comparison}</td><td>{action}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="lesson-caption">{section.caption}</p>
        </>
      )}
      {section.type === 'traversals' && (
        <>
          <figure className="lesson-diagram"><TreeView tree={buildTree(section.keys)} snapshot={null} /></figure>
          <div className="traversal-results">
            {section.orders.map(([name, sequence]) => (
              <div key={name}><strong>{name}</strong><code>{sequence}</code></div>
            ))}
          </div>
        </>
      )}
      {section.type === 'compareTrees' && (
        <div className="lesson-tree-comparison">
          {section.trees.map(([label, keys]) => (
            <figure className="lesson-diagram" key={label}>
              <strong>{label}</strong>
              <TreeView tree={buildTree(keys)} snapshot={null} />
            </figure>
          ))}
        </div>
      )}
      {section.type === 'comparison' && (
        <div className="lesson-comparison">
          {section.items.map(([title, detail]) => <article key={title}><h3>{title}</h3><p>{detail}</p></article>)}
        </div>
      )}
    </section>
  );
}

export default function Lesson({ lessonId = 1 }) {
  const { studentState } = useStudentState();
  const lesson = lessons.find((item) => item.id === lessonId) ?? lessons[0];
  const unlocked = isLessonUnlocked(lesson.id, studentState.masteredLessons);
  const progress = Math.round((studentState.masteredLessons.length / lessons.length) * 100);

  return (
    <main className="learning-shell lesson-shell">
      <LearningHeader lessonId={lesson.id} />
      <div className="lesson-topline">
        <nav className="lesson-breadcrumb" aria-label="Breadcrumb">
          <a href="#welcome">Home</a><span>&gt;</span><span>Lesson {lesson.id}</span><span>&gt;</span><span>{lesson.title}</span>
        </nav>
        <div className="lesson-progress">
          <div className="progress-track" role="progressbar" aria-label="Lessons mastered" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
            <span style={{ width: `${progress}%` }} />
          </div>
          <span>{progress}% done</span>
        </div>
      </div>

      <div className="lesson-layout">
        <section className="lesson-main" aria-labelledby="lesson-title">
          <h1 id="lesson-title">{lesson.title}</h1>
          <p className="lesson-meta">Lesson {lesson.id} <span>|</span> {lesson.focus} <span>|</span> About {lesson.duration} min</p>
          {!unlocked ? (
            <div className="lesson-locked" role="status">
              <h2>This lesson is locked</h2>
              <p>Pass the previous lesson’s quick quiz to unlock this lesson. Activities are optional; the quiz is required.</p>
              <a href={`#lesson?lesson=${lesson.id - 1}`}>Return to the previous lesson</a>
            </div>
          ) : (
            <>
              <div className="lesson-goal">
                <span className="eyebrow">LESSON GOAL</span>
                <p>{lesson.focus}</p>
                <span>Outcomes: {lesson.outcomes.join(', ')}</span>
              </div>
              <p className="lesson-intro">{lesson.intro}</p>
              <div className="lesson-content">
                {lesson.sections.map((section) => <LessonSection key={section.heading} section={section} />)}
              </div>
              <div className="lesson-actions">
                <a href={`#visualizer?lesson=${lesson.id}`}>Try it in the visualiser</a>
                <a href={`#video?lesson=${lesson.id}`}>Watch this lesson’s video</a>
                <a href={`#build-tree?lesson=${lesson.id}`}>{ACTIVITY_LABELS[lesson.id]}</a>
                <a href={`#quiz?lesson=${lesson.id}`}>Take quick quiz</a>
              </div>
              <p className="lesson-requirement-note">
                The activity and video are optional practice. Pass the quick quiz (3 of 4 correct) to unlock the next lesson.
              </p>
            </>
          )}
        </section>

        <aside className="lesson-sidebar">
          <section className="lesson-list-panel" aria-label="Lessons">
            <h2>Lessons</h2>
            <ol>
              {lessons.map((item) => {
                const isMastered = studentState.masteredLessons.includes(item.id);
                const isUnlocked = isLessonUnlocked(item.id, studentState.masteredLessons);
                return (
                  <li className={`${item.id === lesson.id ? 'is-current' : ''}${isMastered ? ' is-complete' : ''}`} key={item.id}>
                    {isUnlocked
                      ? <a href={`#lesson?lesson=${item.id}`}><strong>{item.id}. {item.title}</strong></a>
                      : <strong>{item.id}. {item.title}</strong>}
                    <span>{isMastered ? 'Mastered' : isUnlocked ? 'In progress' : 'Locked'}</span>
                  </li>
                );
              })}
            </ol>
            <div className={`mastery-link${studentState.masteredLessons.length === lessons.length ? '' : ' is-locked'}`}>
              {studentState.masteredLessons.length === lessons.length
                ? <a href="#mastery"><strong>Final mastery check</strong></a>
                : <strong>Final mastery check</strong>}
              <span>{studentState.masteryCheck.passed ? 'Passed' : studentState.masteredLessons.length === lessons.length ? 'Ready' : 'Locked until all lessons are mastered'}</span>
            </div>
          </section>
          <section className="lesson-alternatives" aria-label="Try another way">
            <h2>Try another way</h2>
            <a href={`#video?lesson=${lesson.id}`}>Watch this lesson’s video</a>
            <a href={`#build-tree?lesson=${lesson.id}`}>{ACTIVITY_LABELS[lesson.id]}</a>
          </section>
          <div className="lesson-progress-summary">Progress: {studentState.masteredLessons.length} of 4 lessons mastered</div>
        </aside>
      </div>
    </main>
  );
}
