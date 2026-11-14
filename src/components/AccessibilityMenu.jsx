import { useStudentState } from '../state/StudentState.jsx';

// FR20: reduced-motion setting, saved with the student's progress. The
// operating system's own reduced-motion preference is also honoured in CSS.
export default function AccessibilityMenu() {
  const { studentState, setStudentState } = useStudentState();
  const { reducedMotion } = studentState.settings;

  return (
    <button
      className="reduce-motion-toggle"
      type="button"
      role="switch"
      aria-checked={reducedMotion}
      onClick={() => setStudentState((state) => ({
          ...state,
          settings: { ...state.settings, reducedMotion: !state.settings.reducedMotion },
        }))}
    >
      <span>Reduce motion</span>
      <span className="motion-toggle-state">{reducedMotion ? 'On' : 'Off'}</span>
    </button>
  );
}
