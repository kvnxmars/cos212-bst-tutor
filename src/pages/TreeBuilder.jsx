import LearningHeader from '../components/LearningHeader.jsx';
import ComplexityChallenge from '../components/activities/ComplexityChallenge.jsx';
import SearchInsertionChallenge from '../components/activities/SearchInsertionChallenge.jsx';
import TraversalChallenge from '../components/activities/TraversalChallenge.jsx';
import TreePartsChallenge from '../components/activities/TreePartsChallenge.jsx';
import lessons from '../content/lessons.json';
import { useStudentState } from '../state/StudentState.jsx';
import '../styles/theme.css';

const ACTIVITY_CONTENT = {
  1: {
    title: 'Tree parts & BST rules',
    intro: 'Label a tree, spot a whole-subtree rule violation, and repair the tree.',
    challenge: TreePartsChallenge,
  },
  2: {
    title: 'Search & insert',
    intro: 'Trace the comparisons for 65, then put it in the empty link the search finds.',
    challenge: SearchInsertionChallenge,
  },
  3: {
    title: 'Traversal challenge',
    intro: 'Choose a visit rule and build the output sequence by visiting one node at a time.',
    challenge: TraversalChallenge,
  },
  4: {
    title: 'Shape & search cost',
    intro: 'Choose an insertion order that keeps the tree shallow, then match a structure to its workload.',
    challenge: ComplexityChallenge,
  },
};

export default function TreeBuilderPage({ lessonId = 1 }) {
  const { studentState } = useStudentState();
  const lesson = lessons.find((item) => item.id === lessonId) ?? lessons[0];
  const activity = ACTIVITY_CONTENT[lesson.id];
  const Activity = activity.challenge;
  const progress = Math.round((studentState.masteredLessons.length / lessons.length) * 100);

  return (
    <main className="learning-shell alternate-learning-shell">
      <LearningHeader lessonId={lesson.id} />
      <div className="lesson-topline">
        <nav className="lesson-breadcrumb" aria-label="Breadcrumb">
          <a href="#welcome">Home</a><span>&gt;</span><a href={`#lesson?lesson=${lesson.id}`}>Lesson {lesson.id}</a><span>&gt;</span><span>{activity.title}</span>
        </nav>
        <div className="lesson-progress">
          <div className="progress-track" role="progressbar" aria-label="Lessons mastered" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
            <span style={{ width: `${progress}%` }} />
          </div>
          <span>{progress}% done</span>
        </div>
      </div>
      <section className="tree-challenge-page" aria-labelledby="activity-page-title">
        <p className="eyebrow">LESSON {lesson.id} · HANDS-ON PRACTICE</p>
        <div className="alternate-page-heading">
          <div>
            <h1 id="activity-page-title">{activity.title}</h1>
            <p>{activity.intro}</p>
          </div>
          <a href={`#lesson?lesson=${lesson.id}`}>Back to lesson</a>
        </div>
        <Activity />
        <div className="tree-challenge-footer">
          <a href={`#video?lesson=${lesson.id}`}>Watch this lesson’s video</a>
          <a href={`#quiz?lesson=${lesson.id}`}>Check your understanding</a>
          <a href={`#lesson?lesson=${lesson.id}`}>Return to lesson</a>
        </div>
      </section>
    </main>
  );
}
