import { useStudentState } from '../state/StudentState.jsx';
import { activeBannerIdFor } from '../assessment/rewards.js';

export default function DefaultThemeButton() {
  const { studentState, setStudentState } = useStudentState();
  const isDefault = activeBannerIdFor(studentState) === null;

  return (
    <button
      className="default-theme-button"
      type="button"
      aria-pressed={isDefault}
      onClick={() => setStudentState((state) => ({ ...state, selectedBanner: 'default' }))}
    >
      {isDefault ? 'Default theme' : 'Use default theme'}
    </button>
  );
}
