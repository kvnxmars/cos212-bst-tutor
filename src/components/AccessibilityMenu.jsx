import { useStudentState } from '../state/StudentState.jsx';

// FR20: reduced-motion setting, saved with the student's progress. The
// operating system's own reduced-motion preference is also honoured in CSS.
export default function AccessibilityMenu() {
  const { studentState, setStudentState } = useStudentState();
  const { reducedMotion } = studentState.settings;

  return (
    <label className="reduce-motion-toggle">
      <input
        type="checkbox"
        checked={reducedMotion}
        onChange={(event) => setStudentState((state) => ({
          ...state,
          settings: { ...state.settings, reducedMotion: event.target.checked },
        }))}
      />
      Reduce motion
    </label>
  );
}
