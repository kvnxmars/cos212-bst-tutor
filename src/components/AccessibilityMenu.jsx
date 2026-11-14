import { useStudentState } from '../state/StudentState.jsx';

// FR20: reduced-motion setting, saved with the student's progress. The
// operating system's own reduced-motion preference is also honoured in CSS.
// Sound on/off controls the quiz feedback cues (correct / incorrect answer).
// Rendered inside the Settings panel of CourseNavigation; each switch is one row.
function SettingSwitch({ label, on, onToggle }) {
  return (
    <button className="reduce-motion-toggle" type="button" role="switch" aria-checked={on} onClick={onToggle}>
      <span>{label}</span>
      <span className="motion-toggle-state">{on ? 'On' : 'Off'}</span>
    </button>
  );
}

export default function AccessibilityMenu() {
  const { studentState, setStudentState } = useStudentState();
  const { reducedMotion, soundOn } = studentState.settings;

  function toggleSetting(key) {
    setStudentState((state) => ({
      ...state,
      settings: { ...state.settings, [key]: !state.settings[key] },
    }));
  }

  return (
    <>
      <SettingSwitch label="Reduce motion" on={reducedMotion} onToggle={() => toggleSetting('reducedMotion')} />
      <SettingSwitch label="Sound" on={soundOn} onToggle={() => toggleSetting('soundOn')} />
    </>
  );
}
