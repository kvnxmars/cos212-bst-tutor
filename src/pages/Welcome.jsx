import LearningHeader from '../components/LearningHeader.jsx';
import { resumeLocation } from '../assessment/progress.js';
import { useStudentState } from '../state/StudentState.jsx';

function WelcomeTree() {
  return (
    <svg className="welcome-tree" viewBox="0 0 360 180" role="img" aria-label="Example binary search tree with root 5">
      <line x1="180" y1="40" x2="105" y2="95" />
      <line x1="180" y1="40" x2="255" y2="95" />
      <line x1="105" y1="95" x2="65" y2="145" />
      <line x1="105" y1="95" x2="145" y2="145" />
      <g><circle cx="180" cy="40" r="20" /><text x="180" y="46">5</text></g>
      <g><circle cx="105" cy="95" r="20" /><text x="105" y="101">3</text></g>
      <g><circle cx="255" cy="95" r="20" /><text x="255" y="101">8</text></g>
      <g><circle cx="65" cy="145" r="20" /><text x="65" y="151">1</text></g>
      <g><circle cx="145" cy="145" r="20" /><text x="145" y="151">4</text></g>
    </svg>
  );
}

export default function Welcome() {
  const { studentState } = useStudentState();
  const returning = studentState.masteredLessons.length > 0;

  return (
    <main className="learning-shell welcome-shell">
      <LearningHeader />
      <div className="welcome-breadcrumb">Home</div>
      <section className="welcome-hero" aria-labelledby="welcome-title">
        <h1 id="welcome-title">Welcome!</h1>
        <p className="welcome-tagline">Get to the root of binary search trees, one branch at a time.</p>
        <p className="welcome-slogan-note">A short, self-paced tutor to help you get ready for the lecture.</p>
        <div className="welcome-tree-frame"><WelcomeTree /><span>Binary search tree</span></div>
        {/* FR1: Get started goes straight to the first lesson; SE 4.6: a returning student continues where they left off. */}
        <a
          className="welcome-primary-button"
          href={studentState.masteryCheck.passed ? '#lecture-ready' : resumeLocation(studentState.masteredLessons)}
        >
          {returning ? 'Continue where you left off' : 'Get started'}
        </a>
        <p className="welcome-note">No sign-up needed. Your progress stays in this browser.</p>
      </section>
    </main>
  );
}
