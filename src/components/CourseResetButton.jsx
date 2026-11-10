import { useStudentState } from '../state/StudentState.jsx';

export default function CourseResetButton({ className = '' }) {
  const { resetCourse } = useStudentState();

  return (
    <button className={`course-reset-button${className ? ` ${className}` : ''}`} type="button" onClick={resetCourse}>
      Start course over
    </button>
  );
}
