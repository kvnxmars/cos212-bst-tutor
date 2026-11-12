import { useEffect, useState } from 'react';
import QuizPage from './pages/Quiz.jsx';
import Lesson from './pages/Lesson.jsx';
import VisualizerPage from './pages/Visualizer.jsx';
import Welcome from './pages/Welcome.jsx';
import VideoPage from './pages/Video.jsx';
import TreeBuilderPage from './pages/TreeBuilder.jsx';
import MasteryCheck from './pages/MasteryCheck.jsx';
import LectureReady from './pages/LectureReady.jsx';
import Rewards from './pages/Rewards.jsx';
import { StudentStateProvider } from './state/StudentState.jsx';
import { useStudentState } from './state/StudentState.jsx';
import { isLessonUnlocked } from './assessment/progress.js';
import LessonAccessNotice from './components/LessonAccessNotice.jsx';

function readLocation() {
  const [page, query = ''] = window.location.hash.slice(1).split('?');
  const params = new URLSearchParams(query);
  const requestedLesson = Number(params.get('lesson'));

  return {
    page: page || 'welcome',
    lessonId: Number.isInteger(requestedLesson) && requestedLesson >= 1 && requestedLesson <= 4
      ? requestedLesson
      : 1,
  };
}

function AppRoutes() {
  const [location, setLocation] = useState(readLocation);
  const { studentState } = useStudentState();

  useEffect(() => {
    function updateLocation() {
      setLocation(readLocation());
    }

    window.addEventListener('hashchange', updateLocation);
    return () => window.removeEventListener('hashchange', updateLocation);
  }, []);

  if (
    ['visualizer', 'video', 'build-tree'].includes(location.page)
    && !isLessonUnlocked(location.lessonId, studentState.masteredLessons)
  ) {
    const destinations = { visualizer: 'The visualiser', video: 'This video', 'build-tree': 'This activity' };
    return <LessonAccessNotice lessonId={location.lessonId} destination={destinations[location.page]} />;
  }

  if (location.page === 'visualizer') return <VisualizerPage lessonId={location.lessonId} />;
  if (location.page === 'video') return <VideoPage lessonId={location.lessonId} />;
  if (location.page === 'build-tree') return <TreeBuilderPage lessonId={location.lessonId} />;
  if (location.page === 'lesson') return <Lesson lessonId={location.lessonId} />;
  if (location.page === 'quiz') return <QuizPage lessonId={location.lessonId} />;
  if (location.page === 'mastery') return <MasteryCheck />;
  if (location.page === 'lecture-ready') return <LectureReady />;
  if (location.page === 'rewards') return <Rewards />;
  return <Welcome />;
}

export default function App() {
  return (
    <StudentStateProvider>
      <AppRoutes />
    </StudentStateProvider>
  );
}
